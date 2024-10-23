import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';

const Footer = () => {
  const footerLinks = ['Our Articles', 'About Us', 'Contact Us', 'My Account', 'Privacy Policy'];

  return (
    <footer className="footer">
      <div className="footer-content">
        <nav className="footer-nav">
          <NavLinks links={footerLinks} />
        </nav>
        <p>&copy; {new Date().getFullYear()} Lorem, ipsum. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
