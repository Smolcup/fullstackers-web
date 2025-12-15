import { NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserRole } from "./UserRole";

function NavBar() {
  const role = UserRole();
  const navigate = useNavigate();
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to SignOut")) {
      localStorage.removeItem("token"); // Remove the token from local storage
      navigate("/"); // Navigate to the home page or login page
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Tunisia Travel
        </Link>
        <div className="links">
          <NavLink
            end
            to="/"
            className={({ isActive }) => `link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/destinations"
            className={({ isActive }) => `link ${isActive ? "active" : ""}`}
          >
            Destinations
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) => `link ${isActive ? "active" : ""}`}
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `link ${isActive ? "active" : ""}`}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `link ${isActive ? "active" : ""}`}
          >
            Contact
          </NavLink>
          
          {role === "admin" && <NavLink to="/customers" className={({ isActive }) => `link ${isActive ? "active" : ""}`}>Customers</NavLink>}
          {role === "user" && <NavLink to="/profile" className={({ isActive }) => `link ${isActive ? "active" : ""}`}>Profile</NavLink>}

          {role ? (
            <NavLink to="/" className={({ isActive }) => `link ${isActive ? "active" : ""}`} onClick={handleSignOut}>
              Sign Out
            </NavLink>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `link ${isActive ? "active" : ""}`}>SignUp/In</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
