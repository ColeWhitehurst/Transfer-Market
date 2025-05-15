export const getAllBids = async (token) => {
    const res = await fetch("http://localhost:3000/api/bids", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };
  
  export const getBidsForPlayer = async (playerId) => {
    const res = await fetch(`http://localhost:3000/api/bids/player/${playerId}`);
    return res.json();
  };
  
  export const placeBid = async ({ token, playerId, teamId, amount }) => {
    const res = await fetch("http://localhost:3000/api/bids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ playerId, teamId, amount }),
    });
    return res.json();
  };
  
  export const updateBidStatus = async ({ token, id, action }) => {
    const res = await fetch(`http://localhost:3000/api/bids/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };
  