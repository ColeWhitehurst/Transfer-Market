import { useEffect, useState } from "react";
import { getAllTeams } from "../api/teams";
import TeamCard from "../Components/TeamCard";
import "./CompareTeams.css";

const CompareTeams = () => {
  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getAllTeams();
        setTeams(data);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      }
    };
    fetchTeams();
  }, []);

  const toggleTeam = (team) => {
    setSelected((prev) =>
      prev.find((t) => t.id === team.id)
        ? prev.filter((t) => t.id !== team.id)
        : [...prev, team]
    );
  };

  return (
    <div className="compare-page">
      <h2>Select Teams to Compare</h2>

      <div className="team-selection-grid">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`selectable-wrapper ${
              selected.find((t) => t.id === team.id) ? "selected" : ""
            }`}
            onClick={() => toggleTeam(team)}
          >
            <TeamCard team={team} />
          </div>
        ))}
      </div>

      {selected.length >= 2 && (
        <div className="comparison-grid">
          <h3>Comparison</h3>
          <div className="selected-cards">
            {selected.map((team) => (
              <div key={team.id} className="team-card-expanded">
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="team-logo-large"
                />
                <h3>{team.name}</h3>
                <p>
                  <strong>League:</strong> {team.league}
                </p>
                <p>
                  <strong>Budget:</strong> €{team.budget.toLocaleString()}
                </p>
                <p>
                  <strong>Players:</strong> {team.players.length}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareTeams;