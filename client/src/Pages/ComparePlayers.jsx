import { useEffect, useState } from "react";
import { getPlayers } from "../api/players";
import PlayerCard from "../Components/PlayerCard";
import "./ComparePlayers.css";

const ComparePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, []);

  const togglePlayer = (player) => {
    setSelected((prev) =>
      prev.find((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player]
    );
  };

  return (
    <div className="compare-page">
      <h2>Select Players to Compare</h2>

      <div className="player-selection-grid">
        {players.map((player) => (
          <div
            key={player.id}
            className={`selectable-wrapper ${
              selected.some((p) => p.id === player.id) ? "selected" : ""
            }`}
            onClick={() => togglePlayer(player)}
          >
            <PlayerCard player={player} />
          </div>
        ))}
      </div>

      {selected.length >= 2 && (
        <div className="comparison-grid">
          <h3>Comparison</h3>
          <div className="selected-cards">
            {selected.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePlayers;