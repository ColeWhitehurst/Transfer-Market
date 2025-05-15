import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getAllBids, updateBidStatus } from "../api/bids";

const TransferMarket = () => {
  const { token, teamId } = useAuth();
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
        try {
          const data = await getAllBids(token);
          setBids(data);
        } catch (err) {
          console.error("Failed to fetch bids:", err);
        }
    };

    fetchBids();
  }, [token]);

  const handleDecision = async (id, action) => {
    try {
      const data = await updateBidStatus({ token, id, action });
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        setBids((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: action === "accept" ? "accepted" : "rejected" } : b
          )
        );
      }
    } catch (err) {
      console.error("Failed to process bid:", err);
    }
  };  

  return (
    <div className="transfer-market">
      <h2>Transfer Market</h2>

      {bids.length === 0 ? (
        <p>No bids found.</p>
      ) : (
        <ul className="bid-list">
          {bids.map((bid) => (
            <li key={bid.id} className={`bid-item status-${bid.status}`}>
              <strong>{bid.team.name}</strong> bid €
              {bid.amount.toLocaleString()} for{" "}
              <strong>{bid.player.name}</strong> (
              {bid.player.position || "Unknown"}) —<em> {bid.status}</em>
              {bid.status === "pending" && bid.player.team?.id === teamId && (
                <>
                  <button onClick={() => handleDecision(bid.id, "accept")}>
                    Accept
                  </button>
                  <button onClick={() => handleDecision(bid.id, "reject")}>
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransferMarket;