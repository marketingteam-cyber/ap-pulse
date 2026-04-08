import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { nodePositions } from '../data/mockData';

const nodeTypes = { custom: CustomNode };

export default function FloorMap({
  graphData,
  rooms,
  pathResult,
  startNode,
  endNode,
  heatmapData,
  showHeatmap,
  onNodeClick,
  navMode,
  onMapNodeSelect,
}) {
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);
  const [animatedEdges, setAnimatedEdges] = useState(new Set());

  // Build room status map
  const roomStatusMap = useMemo(() => {
    const map = {};
    if (rooms) {
      rooms.forEach(r => { map[r.id] = r.status; });
    }
    return map;
  }, [rooms]);

  // Build path set for highlighting
  const pathSet = useMemo(() => {
    if (!pathResult?.path) return new Set();
    return new Set(pathResult.path);
  }, [pathResult]);

  // Build path edge pairs
  const pathEdgePairs = useMemo(() => {
    if (!pathResult?.path || pathResult.path.length < 2) return new Set();
    const pairs = new Set();
    for (let i = 0; i < pathResult.path.length - 1; i++) {
      pairs.add(`${pathResult.path[i]}->${pathResult.path[i + 1]}`);
      pairs.add(`${pathResult.path[i + 1]}->${pathResult.path[i]}`);
    }
    return pairs;
  }, [pathResult]);

  // Animate path edges sequentially
  useEffect(() => {
    if (!pathResult?.path || pathResult.path.length < 2) {
      setAnimatedEdges(new Set());
      return;
    }

    setAnimatedEdges(new Set());
    const timers = [];

    for (let i = 0; i < pathResult.path.length - 1; i++) {
      const timer = setTimeout(() => {
        setAnimatedEdges(prev => {
          const next = new Set(prev);
          next.add(`${pathResult.path[i]}->${pathResult.path[i + 1]}`);
          next.add(`${pathResult.path[i + 1]}->${pathResult.path[i]}`);
          return next;
        });
      }, i * 300);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [pathResult]);

  // Build React Flow nodes
  useEffect(() => {
    if (!graphData?.nodes) return;

    const nodes = Object.entries(graphData.nodes).map(([id, node]) => ({
      id,
      type: 'custom',
      position: nodePositions[id] || { x: node.x, y: node.y },
      data: {
        label: node.label,
        nodeType: node.type,
        nodeId: id,
        status: roomStatusMap[id],
        isOnPath: pathSet.has(id),
        isStart: id === startNode,
        isEnd: id === endNode,
        isHeatmapActive: showHeatmap,
        heatValue: showHeatmap && heatmapData?.zones?.[id]?.traffic,
        onClick: () => {
          if (navMode) {
            onMapNodeSelect?.(id);
          } else {
            onNodeClick?.(id);
          }
        },
      },
    }));

    setRfNodes(nodes);
  }, [graphData, roomStatusMap, pathSet, startNode, endNode, showHeatmap, heatmapData, navMode]);

  // Build React Flow edges
  useEffect(() => {
    if (!graphData?.edges) return;

    const edgeSet = new Set();
    const edges = [];

    Object.entries(graphData.edges).forEach(([source, targets]) => {
      Object.entries(targets).forEach(([target, weight]) => {
        const edgeKey = [source, target].sort().join('--');
        if (edgeSet.has(edgeKey)) return;
        edgeSet.add(edgeKey);

        const isOnPath = pathEdgePairs.has(`${source}->${target}`);
        const isAnimated = animatedEdges.has(`${source}->${target}`);

        edges.push({
          id: `e-${source}-${target}`,
          source,
          target,
          type: 'default',
          style: {
            stroke: isOnPath
              ? (isAnimated ? '#1A4FAD' : '#CBD5E1')
              : '#E2E8F0',
            strokeWidth: isOnPath ? (isAnimated ? 4 : 2) : 1.5,
            strokeDasharray: isOnPath && isAnimated ? '10 5' : undefined,
            transition: 'stroke 0.3s, stroke-width 0.3s',
          },
          className: isOnPath && isAnimated ? 'animated-path' : '',
          animated: isOnPath && isAnimated,
          label: isOnPath ? `${weight}` : undefined,
          labelStyle: {
            fontSize: 10,
            fontWeight: 700,
            fill: '#1A4FAD',
          },
          labelBgStyle: {
            fill: '#EFF6FF',
            fillOpacity: 0.9,
          },
          labelBgPadding: [4, 2],
          labelBgBorderRadius: 4,
        });
      });
    });

    setRfEdges(edges);
  }, [graphData, pathEdgePairs, animatedEdges]);

  const onNodeClickHandler = useCallback((_, node) => {
    if (navMode) {
      onMapNodeSelect?.(node.id);
    } else {
      onNodeClick?.(node.id);
    }
  }, [navMode, onMapNodeSelect, onNodeClick]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-surface-200 bg-white shadow-sm">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'default' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E8F0" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-white !border-surface-200 !rounded-xl !shadow-sm"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === startNode) return '#22C55E';
            if (node.id === endNode) return '#DC2626';
            if (pathSet.has(node.id)) return '#1A4FAD';
            return '#CBD5E1';
          }}
          maskColor="rgba(241, 245, 249, 0.7)"
          className="!bg-white"
        />
      </ReactFlow>
    </div>
  );
}
