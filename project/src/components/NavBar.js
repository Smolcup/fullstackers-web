import { NavLink, Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">Tunisia Travel</Link>
        <div className="links">
          <NavLink end to="/" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/destinations" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>Destinations</NavLink>
          <NavLink to="/marketplace" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>Marketplace</NavLink>
          <NavLink to="/about" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
