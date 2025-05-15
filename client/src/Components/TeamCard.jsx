import { useTheme } from '../Context/ThemeContext';
import "./TeamCard.css";

const TeamCard = ({ team, onClick }) => {
    const { theme } = useTheme();

    const style = {
        "--primary-color": theme.primary,
        "--accent-color": theme.accent,
        "--text-color": theme.text,
    };

  return (
    <div className="team-card" style ={style} onClick={onClick}>
      <img
        src={team.logoUrl || "https://via.placeholder.com/80x80?text=No+Logo"}
        alt={`${team.name} logo`}
        className="team-logo"
      />
      <div className="team-info">
        <h4>{team.name}</h4>
        <p className="league">{team.league}</p>
      </div>
    </div>
  );
};

export default TeamCard;