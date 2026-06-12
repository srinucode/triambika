import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <span className="brand-highlight">Triambika</span> Foods
        </Link>

        <nav className="nav-links">
          <Link to="/">Live Items</Link>
          <Link to="/catering">Catering</Link>
          <Link to="/admin/login">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;