import "./TeamCard.css";

const TeamCard = ({ team, onClick }) => {
  return (
    <div className="team-card" onClick={onClick}>
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