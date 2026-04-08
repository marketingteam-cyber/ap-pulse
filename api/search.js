const rooms = require('./_data/rooms.json');
const people = require('./_data/people.json');

module.exports = function handler(req, res) {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) {
    return res.json({ rooms: [], people: [] });
  }

  const matchedRooms = rooms
    .filter(r => r.name.toLowerCase().includes(query) || r.id.toLowerCase().includes(query))
    .map(r => ({ id: r.id, name: r.name, type: 'room', status: r.status }));

  const matchedPeople = people
    .filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.role.toLowerCase().includes(query) ||
      p.department.toLowerCase().includes(query))
    .map(p => ({ id: p.id, name: p.name, type: 'person', role: p.role, location: p.location }));

  res.json({ rooms: matchedRooms, people: matchedPeople });
};
