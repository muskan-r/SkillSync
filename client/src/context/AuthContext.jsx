import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginUser = async (data) => {
    const res = await authService.login(data);
    setUser(res.data.user);
    return res.data;
  };

  const registerUser = async (data) => {
    const res = await authService.register(data);
    setUser(res.data.user);
    return res.data;
  };

  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, loginUser, registerUser, logoutUser, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};