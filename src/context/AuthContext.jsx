import React, { createContext, useContext } from "react";
import useCookie from "react-use-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token] = useCookie("token");

  return <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
