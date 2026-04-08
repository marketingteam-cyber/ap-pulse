/**
 * Dijkstra's shortest path algorithm.
 * @param {Object} graph  – adjacency list  { nodeId: { neighborId: weight, … }, … }
 * @param {string} start
 * @param {string} end
 * @returns {{ path: string[], distance: number, estimatedTime: string }}
 */
module.exports = function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  for (const node of nodes) distances[node] = Infinity;
  distances[start] = 0;

  while (true) {
    let current = null;
    let smallestDist = Infinity;
    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < smallestDist) {
        current = node;
        smallestDist = distances[node];
      }
    }
    if (current === null || current === end) break;

    visited.add(current);

    const neighbors = graph[current] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      if (visited.has(neighbor)) continue;
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
      }
    }
  }

  if (distances[end] === Infinity) {
    return { path: [], distance: -1, estimatedTime: null };
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  const totalSeconds = distances[end] * 30;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const estimatedTime = minutes > 0
    ? `${minutes} min ${seconds > 0 ? seconds + ' sec' : ''}`
    : `${seconds} sec`;

  return { path, distance: distances[end], estimatedTime: estimatedTime.trim() };
};
