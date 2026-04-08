// Mock auth — in production, replace with real user creation
module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }

  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    department: role === 'employer' ? 'Management' : 'General',
  };

  res.json({ success: true, user });
};
