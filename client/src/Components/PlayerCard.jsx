import { useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import "./PlayerCard.css";

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const style = {
    "--primary-color": theme.primary,
        "--accent-color": theme.accent,
        "--text-color": theme.text,
  }

  return (
    <div className="player-card" style={style} onClick={() => navigate(`/players/${player.id}`)}>
      <img
        src={player.imageUrl || "https://via.placeholder.com/80x80?text=No+Image"}
        alt={player.name}
        className="player-image"
      />
      <div className="player-info">
        <h4>{player.name}</h4>
        <p>{player.position || "Unknown Position"}</p>
        <p>Age: {player.age ?? "?"}</p>
        <p>Value: €{player.marketValue.toLocaleString()}</p>
        {player.team?.name && <p>Team: {player.team.name}</p>}
      </div>
    </div>
  );
};

export default PlayerCard;