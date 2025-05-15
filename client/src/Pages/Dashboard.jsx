import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { getTeamById } from "../api/teams";

const Dashboard = () => {
  const { teamId, username, logout } = useAuth();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeamById(teamId);
        setTeam(data);
      } catch (err) {
        console.error("Failed to fetch team:", err);
      }
    };

    if (teamId) fetchTeam();
  }, [teamId]);

  if (!team) return <p>Loading your team...</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {username}!</h2>

      <div className="team-overview">
        <h3>{team.name}</h3>
        {team.logoUrl && (
          <img src={team.logoUrl} alt={`${team.name} logo`} width={100} />
        )}
        <p>
          <strong>Budget:</strong> €{team.budget.toLocaleString()}
        </p>
      </div>

      <h4>Your Players</h4>
      <ul className="team-roster">
        {team.players.map((p) => (
          <li key={p.id}>
            {p.name} – {p.position || "Unknown"} – €
            {p.marketValue.toLocaleString()}
          </li>
        ))}
      </ul>

      <div className="dashboard-links">
        <Link to="/scout">Scout Players</Link> |{" "}
        <Link to="/bids">Transfer Market</Link> |{" "}
        <Link to={`/teams/${teamId}`}>Full Team View</Link> |{" "}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;