import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'insightcart_auth';

// Mock user database
const mockUsers = [
  {
    id: 'u1',
    name: 'Demo User',
    email: 'demo@insightcart.com',
    password: 'demo1234',
    avatar: null,
    preferences: ['Skincare', 'Hair Care'],
    role: 'user',
    createdAt: '2025-01-15',
  },
  {
    id: 'u2',
    name: 'Admin User',
    email: 'admin@insightcart.com',
    password: 'admin1234',
    avatar: null,
    preferences: [],
    role: 'admin',
    createdAt: '2025-01-01',
  },
];

function generateToken() {
  return 'mock_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { user: storedUser, token: storedToken } = JSON.parse(stored);
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  // Persist session
  const persistSession = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: authToken }));
    localStorage.setItem('auth_token', authToken);
  }, []);

  const login = useCallback(async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    const found = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userData } = found;
    const authToken = generateToken();
    persistSession(userData, authToken);
    return userData;
  }, [persistSession]);

  const register = useCallback(async (name, email, password, preferences = []) => {
    await new Promise(r => setTimeout(r, 1000));

    // Check if email exists
    const exists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists');
    }

    const userData = {
      id: 'u' + (mockUsers.length + 1),
      name,
      email,
      avatar: null,
      preferences,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Add to mock DB
    mockUsers.push({ ...userData, password });

    const authToken = generateToken();
    persistSession(userData, authToken);
    return userData;
  }, [persistSession]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('auth_token');
  }, []);

  const updatePreferences = useCallback((preferences) => {
    if (user) {
      const updated = { ...user, preferences };
      setUser(updated);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.user = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    }
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
