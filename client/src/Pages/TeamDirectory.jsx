import { useEffect, useState } from "react";
import { getAllTeams } from "../api/teams";
import TeamCard from "../components/TeamCard";
import TeamModal from "../components/TeamModal";
import "./TeamDirectory.css";

const LEAGUES = [
  "Premier League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1",
];

const TeamDirectory = () => {
  const [teams, setTeams] = useState([]);
  const [league, setLeague] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const query = league ? `?league=${encodeURIComponent(league)}` : "";
        const res = await getAllTeams(query);
        setTeams(res);
      } catch (err) {
        console.error("Failed to load teams", err);
      }
    };

    fetchTeams();
  }, [league]);

  return (
    <div className="team-directory">
      <h2>Explore Teams</h2>

      <select
        className="league-filter"
        value={league}
        onChange={(e) => setLeague(e.target.value)}
      >
        <option value="">All Leagues</option>
        {LEAGUES.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <div className="team-grid">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onClick={() => setSelectedTeam(team)} />
        ))}
      </div>

      {selectedTeam && (
        <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
};

export default TeamDirectory;