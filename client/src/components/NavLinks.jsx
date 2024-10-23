import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ links, onClick }) => {
  return (
    <>
      {links.map((item, index) => (
        <p key={index}>
          <Link to={`/${item.toLowerCase().replace(/\s/g, '')}`} onClick={onClick}>
            {item}
          </Link>
        </p>
      ))}
    </>
  );
};

export default NavLinks;
