const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load data
const graphData = require('./data/graph.json');
const rooms = require('./data/rooms.json');
const people = require('./data/people.json');
const ads = require('./data/ads.json');
const heatmapData = require('./data/heatmap.json');

// ─── Dijkstra's Algorithm ────────────────────────────────────────────
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  // Initialize distances
  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  while (true) {
    // Find unvisited node with smallest distance
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

    // Update distances for neighbors
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

  // Reconstruct path
  if (distances[end] === Infinity) {
    return { path: [], distance: -1, estimatedTime: null };
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  // Estimated time: ~30 seconds per unit distance (walking speed indoors)
  const totalSeconds = distances[end] * 30;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const estimatedTime = minutes > 0
    ? `${minutes} min ${seconds > 0 ? seconds + ' sec' : ''}`
    : `${seconds} sec`;

  return {
    path,
    distance: distances[end],
    estimatedTime: estimatedTime.trim(),
  };
}

// ─── API Routes ──────────────────────────────────────────────────────

// Shortest path
app.post('/api/shortest-path', (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end locations are required' });
  }

  if (!graphData.edges[start]) {
    return res.status(404).json({ error: `Start location "${start}" not found` });
  }

  if (!graphData.edges[end] && !Object.values(graphData.edges).some(e => e[end] !== undefined)) {
    return res.status(404).json({ error: `End location "${end}" not found` });
  }

  const result = dijkstra(graphData.edges, start, end);

  if (result.distance === -1) {
    return res.status(404).json({ error: 'No path found between the specified locations' });
  }

  res.json(result);
});

// Graph data (for frontend map rendering)
app.get('/api/graph', (req, res) => {
  res.json(graphData);
});

// Rooms
app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/api/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// Search
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) {
    return res.json({ rooms: [], people: [] });
  }

  const matchedRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.id.toLowerCase().includes(query)
  ).map(r => ({ id: r.id, name: r.name, type: 'room', status: r.status }));

  const matchedPeople = people.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.role.toLowerCase().includes(query) ||
    p.department.toLowerCase().includes(query)
  ).map(p => ({ id: p.id, name: p.name, type: 'person', role: p.role, location: p.location }));

  res.json({ rooms: matchedRooms, people: matchedPeople });
});

// People
app.get('/api/people', (req, res) => {
  res.json(people);
});

// Heatmap data
app.get('/api/heatmap', (req, res) => {
  res.json(heatmapData);
});

// Ad zones
app.get('/api/ads', (req, res) => {
  res.json(ads);
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`AP Pulse backend running on http://localhost:${PORT}`);
});
