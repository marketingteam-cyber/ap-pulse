const rooms = require('../_data/rooms.json');

module.exports = function handler(req, res) {
  const room = rooms.find(r => r.id === req.query.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
};
