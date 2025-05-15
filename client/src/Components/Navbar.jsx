import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaSearch, FaUsers, FaGavel, FaBalanceScale, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/scout", label: "Scout Players", icon: <FaSearch /> },
    { path: "/teams", label: "Explore Teams", icon: <FaUsers /> },
    { path: "/bids", label: "Transfer Market", icon: <FaGavel /> },
    {
      path: "/compare/players",
      label: "Compare Players",
      icon: <FaBalanceScale />,
    },
    { path: "/compare/teams", label: "Compare Teams", icon: <FaChartBar /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          ⚽ Transfer Market
        </NavLink>
      </div>

      <div className="navbar-links">
        {links.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
        <button onClick={handleLogout} classname="navbar-link logout-button"  >
            <FaSignOutAlt />
            <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
