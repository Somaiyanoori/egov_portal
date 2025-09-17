    // src/context/AuthContext.jsx
    import React, { createContext, useState, useContext, useEffect } from 'react';
    import { getMe } from '../services/authService';
    import api from '../services/api';

    const AuthContext = createContext(null);


    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true); 

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
    
