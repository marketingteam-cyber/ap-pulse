const rooms = require('../_data/rooms.json');

module.exports = function handler(req, res) {
  res.json(rooms);
};
