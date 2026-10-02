import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isProjectsActive = location.pathname.startsWith("/projects");

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">

        <Link to="/" className="logo">
          <span className="logo-mark">TW</span>
          <span className="logo-text">TECH WORLD</span>
        </Link>

        <button
          className={`mobile-menu-button ${
            menuOpen ? "menu-active" : ""
          }`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
          >
            <span>01</span>
            Home
          </Link>

          <Link
            to="/about"
            className={isActive("/about") ? "active" : ""}
          >
            <span>02</span>
            About
          </Link>

          <Link
            to="/services"
            className={isActive("/services") ? "active" : ""}
          >
            <span>03</span>
            Services
          </Link>

          <Link
            to="/projects"
            className={isProjectsActive ? "active" : ""}
          >
            <span>04</span>
            Projects
          </Link>

          <Link
            to="/contact"
            className={isActive("/contact") ? "active" : ""}
          >
            <span>05</span>
            Contact
          </Link>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;