const graphData = require('./_data/graph.json');

module.exports = function handler(req, res) {
  res.json(graphData);
};
