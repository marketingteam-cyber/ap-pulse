import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Pre-seeded demo accounts
const DEMO_ACCOUNTS = [
  {
    id: 'demo-emp',
    name: 'Alex Rivera',
    email: 'employee@appulse.io',
    password: 'password',
    role: 'employee',
    department: 'Engineering',
  },
  {
    id: 'demo-admin',
    name: 'Jordan Hayes',
    email: 'admin@appulse.io',
    password: 'password',
    role: 'employer',
    department: 'Management',
  },
];

function getStoredUsers() {
  try {
    const stored = localStorage.getItem('ap_pulse_users');
    if (stored) return JSON.parse(stored);
  } catch {}
  // Seed with demo accounts on first load
  localStorage.setItem('ap_pulse_users', JSON.stringify(DEMO_ACCOUNTS));
  return DEMO_ACCOUNTS;
}

function saveUsers(users) {
  localStorage.setItem('ap_pulse_users', JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem('ap_pulse_session');
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role, department: found.department };
    setUser(sessionUser);
    localStorage.setItem('ap_pulse_session', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  };

  const signup = ({ name, email, password, role }) => {
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      department: role === 'employer' ? 'Management' : 'General',
    };

    users.push(newUser);
    saveUsers(users);

    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department };
    setUser(sessionUser);
    localStorage.setItem('ap_pulse_session', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ap_pulse_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
