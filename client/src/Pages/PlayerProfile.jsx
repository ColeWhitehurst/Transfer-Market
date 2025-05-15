import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import StatGraph from "../Components/StatsGraph";
import { getPlayerById } from "../api/players";
import { placeBid, getBidsForPlayer } from "../api/bids";

const PlayerProfile = () => {
  const [bids, setBids] = useState([]);
  const { id } = useParams();
  const { token, teamId } = useAuth();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [playerData, bidData] = await Promise.all([
          getPlayerById(id),
          getBidsForPlayer(id),
        ]);
        setPlayer(playerData);
        setBids(bidData);
      } catch (err) {
        console.error("Failed to fetch player or bids:", err);
      }
    };
  
    fetchAll();
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    try {
      const data = await placeBid({
        token,
        playerId: player.id,
        teamId,
        amount: parseInt(bidAmount),
      });
  
      if (data.error) {
        alert(data.error);
      } else {
        alert("Bid placed successfully!");
        navigate("/bids");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting bid");
    }
  };

  if (!player) return <p>Loading player...</p>;

  const alreadyOwnsPlayer = player.team?.id === teamId;

  return (
    <div className="player-profile">
      <h2>{player.name}</h2>
      <img
        src={player.imageUrl || "https://via.placeholder.com/150"}
        alt={player.name}
        style={{ width: "150px", borderRadius: "10px" }}
      />
      <p>Position: {player.position || "Unknown"}</p>
      <p>Age: {player.age ?? "?"}</p>
      <p>Nationality: {player.nationality || "Unknown"}</p>
      <p>Market Value: €{player.marketValue.toLocaleString()}</p>
      <p>Current Team: {player.team?.name || "Free Agent"}</p>

      {!alreadyOwnsPlayer ? (
        <form onSubmit={handleBid} className="bid-form">
          <input
            type="number"
            placeholder="Your Offer (€)"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
          <button type="submit">Place Bid</button>
        </form>
      ) : (
        <p>You already own this player.</p>
      )}
      {bids.length > 0 && (
        <div className="player-bids">
          <h3>Active Bids</h3>
          <ul>
            {bids.map((bid) => (
              <li key={bid.id}>
                {bid.team.name} offered €{bid.amount.toLocaleString()} —{" "}
                <em>{bid.status}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
      {player && <StatGraph player={player} />}
    </div>
  );
};

export default PlayerProfile;
