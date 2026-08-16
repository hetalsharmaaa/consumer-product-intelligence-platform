import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/api/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'insightcart_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: profile, token }));
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally { setLoading(false); }
    };
    restore();
  }, [token]);

  const persist = useCallback((data) => {
    localStorage.setItem('access_token', data.access || data.token); // Handle varying backend token keys
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
    setToken(data.access || data.token);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email: email.trim(), password });
    persist(data);
    const profile = await authService.getProfile();
    setUser(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: profile, token: data.access || data.token }));
    return profile;
  }, [persist]);

  const register = useCallback(async (name, email, password) => {
    await authService.register({
      username: name.trim().replace(/\s+/g, '_').toLowerCase(),
      email: email.trim(),
      password,
    });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updatePreferences = useCallback((preferences) => {
    setUser(prev => prev ? { ...prev, preferences } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated: !!user,
      isAdmin: !!user?.is_staff,
      login, register, logout, updatePreferences,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
