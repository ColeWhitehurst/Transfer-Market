import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { pathname } = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/scout", label: "Scout Players" },
    { path: "/teams", label: "Explore Teams" },
    { path: "/bids", label: "Transfer Market" },
    { path: "/compare/players", label: "Compare Players" },
    { path: "/compare/teams", label: "Compare Teams" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          ⚽ Transfer Market
        </Link>
      </div>

      <div className="navbar-links">
        {links.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`navbar-link ${pathname === path ? "active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;