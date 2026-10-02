import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSocialLinks } from "../services/api";

function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await getSocialLinks();
        setSocialLinks(data);
      } catch (err) {
        console.error("FOOTER SOCIAL ERROR:", err);
      }
    };

    loadSocialLinks();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-top-line"></div>

      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">TW</span>
            <span className="footer-logo-text">TECH WORLD</span>
          </Link>

          <p>
            Software development, technology and digital
            solutions built with a practical approach.
          </p>

          <Link to="/contact" className="footer-contact-link">
            Start a conversation
            <span>↗</span>
          </Link>
        </div>

        <div className="footer-navigation">
          <span className="footer-title">
            NAVIGATION
          </span>

          <Link to="/">
            <span>Home</span>
            <small>01</small>
          </Link>

          <Link to="/about">
            <span>About</span>
            <small>02</small>
          </Link>

          <Link to="/services">
            <span>Services</span>
            <small>03</small>
          </Link>

          <Link to="/projects">
            <span>Projects</span>
            <small>04</small>
          </Link>

          <Link to="/contact">
            <span>Contact</span>
            <small>05</small>
          </Link>
        </div>

        <div className="footer-social">
          <span className="footer-title">
            CONNECT
          </span>

          {socialLinks.length > 0 ? (
            socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>{social.platform}</span>
                <small>↗</small>
              </a>
            ))
          ) : (
            <span className="footer-no-social">
              Social links coming soon.
            </span>
          )}
        </div>

      </div>

      <div className="footer-bottom">
        <span>
          © {currentYear} TECH WORLD
        </span>

        <span className="footer-bottom-center">
          Designed & built with purpose.
        </span>

        <Link to="/">
          Back to top ↑
        </Link>
      </div>

    </footer>
  );
}

export default Footer;