const ads = require('./_data/ads.json');

module.exports = function handler(req, res) {
  res.json(ads);
};
