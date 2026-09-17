import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("adminToken"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  return { token, isAuthenticated: !!token, login, logout };
}