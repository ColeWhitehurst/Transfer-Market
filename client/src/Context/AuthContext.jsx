import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [teamId, setTeamId] = useState(localStorage.getItem("teamId"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedTeamId = localStorage.getItem("teamId");
  
    if (storedToken && storedTeamId) {
      setToken(storedToken);
      setUsername(storedUsername);
      setTeamId(parseInt(storedTeamId));
    }
  
    setLoading(false);
  }, []);

  const login = ({ token, username, teamId }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("teamId", teamId);
    setToken(token);
    setUsername(username);
    setTeamId(teamId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("teamId");
    setToken(null);
    setUsername(null);
    setTeamId(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, teamId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};