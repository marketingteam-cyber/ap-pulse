const graphData = require('./_data/graph.json');
const dijkstra = require('./_lib/dijkstra');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};
