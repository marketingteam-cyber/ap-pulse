const people = require('./_data/people.json');

module.exports = function handler(req, res) {
  res.json(people);
};
