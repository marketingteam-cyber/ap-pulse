const heatmapData = require('./_data/heatmap.json');

module.exports = function handler(req, res) {
  res.json(heatmapData);
};
