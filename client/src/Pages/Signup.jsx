import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { signup } from "../api/auth";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    teamId: "",
  });

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch("/api/teams");
      const data = await res.json();
      console.log(data);
      
      setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await signup(formData);
      if (data.token) {
        login(data);
        navigate("/dashboard");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error signing up");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign up as a Manager</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <select
          name="teamId"
          onChange={handleChange}
          value={formData.teamId}
          required
        >
          <option value="">Select Your Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
