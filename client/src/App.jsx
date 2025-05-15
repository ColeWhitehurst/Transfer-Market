import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import { teamThemes } from "./Theme/teamThemes";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Scout from "./Pages/Scout";
import PlayerProfile from "./Pages/PlayerProfile";
import TransferMarket from "./Pages/TransferMarket";
import TeamDirectory from "./Pages/TeamDirectory";
import Navbar from "./Components/Navbar";
import ComparePlayers from "./Pages/ComparePlayers";
import CompareTeams from "./Pages/CompareTeams";
import "./App.css";

function App() {
  const { teamId, loading } = useAuth();
  const location = useLocation();

  const noThemeRoutes = ["/login", "/signup"];
  const isAuthPage = noThemeRoutes.includes(location.pathname.toLowerCase());
  const teamTheme = teamThemes[teamId];

  useEffect(() => {
    if (!teamTheme) return;

    if (teamTheme) {
      root.style.setProperty("--primary-color", teamTheme.primary);
      root.style.setProperty("--accent-color", teamTheme.accent);
      root.style.setProperty("--text-color", teamTheme.text || "#f5f5f5");
    } else {
      root.style.setProperty("--primary-color", "#4682B4");
      root.style.setProperty("--accent-color", "#00356B");
      root.style.setProperty("--text-color", "#990000");
    }
  }, [teamTheme]);

  if (loading) {
    return (
      <div className="splash-screen">
        <h1>Transfer Market</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className={!isAuthPage ? "app-container themed" : ""}>
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scout" element={<Scout />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/bids" element={<TransferMarket />} />
            <Route path="/teams" element={<TeamDirectory />} />
            <Route path="/compare/players" element={<ComparePlayers />} />
            <Route path="/compare/teams" element={<CompareTeams />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;