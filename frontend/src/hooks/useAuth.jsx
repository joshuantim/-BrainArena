import { createContext, useContext, useState, useEffect } from 'react';
import { apiGetMe, apiLogin, apiRegister, apiLogout, isLoggedIn } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      if (!isLoggedIn()) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiGetMe();
        setUser(data.user);
      } catch (err) {
        // Token invalid/expired — clear it
        apiLogout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await apiRegister(username, email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
