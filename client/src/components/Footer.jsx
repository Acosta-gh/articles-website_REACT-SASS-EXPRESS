import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <nav className="footer-nav">
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} Lorem, ipsum. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
