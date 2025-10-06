import React, { createContext, useState, useContext, useEffect } from "react";
import { getMe } from "../services/authService";
import api from "../services/api";

// Create a context to hold authentication state.
const AuthContext = createContext(null);

// Create a provider component to wrap the application and manage auth state.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to check for a logged-in user when the app loads.
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  // Function to clear the user data on logout.
  const logout = () => {
    setUser(null);
  };
  const value = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
