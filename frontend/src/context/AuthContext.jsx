import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("maison_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("maison_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/user")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("maison_user", JSON.stringify(res.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("maison_token");
        localStorage.removeItem("maison_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (data) => {
    localStorage.setItem("maison_token", data.token);
    localStorage.setItem("maison_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (credentials) => {
    const res = await api.post("/login", credentials);
    persist(res.data);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post("/register", payload);
    persist(res.data);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("maison_token");
    localStorage.removeItem("maison_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
