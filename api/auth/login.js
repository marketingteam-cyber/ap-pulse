// Mock auth — in production, replace with real authentication
const DEMO_ACCOUNTS = [
  { id: 'demo-emp', name: 'Alex Rivera', email: 'employee@appulse.io', password: 'password', role: 'employee' },
  { id: 'demo-admin', name: 'Jordan Hayes', email: 'admin@appulse.io', password: 'password', role: 'employer' },
];

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const user = DEMO_ACCOUNTS.find(
    (u) => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...safe } = user;
  res.json({ success: true, user: safe });
};
