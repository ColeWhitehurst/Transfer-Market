import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../Components/PlayerCard";
import { getPlayers } from "../api/players";

const Scout = () => {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState({
    position: "",
    maxValue: "",
    age: "",
  });
  const navigate = useNavigate();

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers(filters);
      setPlayers(data);
    } catch (err) {
      console.error("Failed to fetch players:", err);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchPlayers();
  };

  return (
    <div className="scout-container">
      <h2>Scout Players</h2>

      <form onSubmit={handleFilter} className="scout-filters">
        <input
          name="position"
          placeholder="Position"
          value={filters.position}
          onChange={handleChange}
        />
        <input
          name="age"
          placeholder="Max Age"
          type="number"
          value={filters.age}
          onChange={handleChange}
        />
        <input
          name="maxValue"
          placeholder="Max Market Value"
          type="number"
          value={filters.maxValue}
          onChange={handleChange}
        />
        <button type="submit">Filter</button>
      </form>

      <div className="scout-results">
        {players.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
};

export default Scout;
