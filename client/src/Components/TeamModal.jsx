import "./TeamModal.css";

const TeamModal = ({ team, onClose }) => {
  return (
    <div className="team-modal-overlay" onClick={onClose}>
      <div className="team-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="team-modal-header">
          <img
            src={
              team.logoUrl || "https://via.placeholder.com/80x80?text=No+Logo"
            }
            alt={`${team.name} logo`}
            className="team-modal-logo"
          />
          <div>
            <h2>{team.name}</h2>
            <p>
              <strong>League:</strong> {team.league}
            </p>
            <p>
              <strong>Budget:</strong> €{team.budget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="team-modal-body">
          <h3>Players</h3>
          <ul className="team-player-list">
            {team.players.map((player) => (
              <li key={player.id}>
                {player.name} – {player.position || "?"} – €
                {player.marketValue.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;