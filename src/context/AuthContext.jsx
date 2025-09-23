import React, { createContext, useContext } from "react";
import useCookie from "react-use-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken, removeToken] = useCookie("token");

  const login = (data) => {
    if (data.token) setToken(data.token, { path: "/", sameSite: "Strict" });
    if (data.user && data.user.avatar) localStorage.setItem("avatar", data.user.avatar);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("avatar");
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
