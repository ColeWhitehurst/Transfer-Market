export const getPlayers = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`http://localhost:3000/api/players/search?${params.toString()}`);
    return res.json();
  };
  
  export const getPlayerById = async (id) => {
    const res = await fetch(`http://localhost:3000/api/players/${id}`);
    return res.json();
  };
  