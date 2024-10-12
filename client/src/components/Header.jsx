import React, { useState, useEffect, useRef } from 'react';
import Hamburger from 'hamburger-react';
import { Link } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { PiGitlabLogoSimpleFill } from "react-icons/pi";

function Header() {
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const [isOpen, setOpen] = useState(false); // https://hamburger-react.netlify.app/

    const searchRef = useRef(null);
    const iconRef = useRef(null);

    const toggleNav = () => {
        setIsNavVisible(!isNavVisible);
    };

    const toggleSearch = () => { 
        setIsSearchVisible(!isSearchVisible);
    };

    useEffect(() => {  // Handles clicks outside the search field and the search icon | Maneja clics fuera del campo de búsqueda y el ícono de búsqueda
        const handleClickOutside = (event) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)
            ) {
                setIsSearchVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='header'>
            <div className='header-burguer' onClick={toggleNav}>
                <Hamburger toggled={isOpen} toggle={setOpen} size={25} />
            </div>
            <nav className={`header-nav ${isNavVisible ? 'visible' : ''}`}>
                <Link to="/articles"><p>Our Articles</p></Link>
                <Link to="/"><p>About Us</p></Link>
                <Link to="/contact"><p>Contact Us</p></Link>
            </nav>
            <input 
                ref={searchRef}
                className={`header-search ${isSearchVisible ? 'visible' : ''}`} 
                type='text' 
                placeholder='Search By...' 
            />
          
            <div className='header-logo'>
                <PiGitlabLogoSimpleFill />
            </div>
            <div 
                className='header-search_icon' 
                onClick={toggleSearch} 
                ref={iconRef}
            >
                <LuSearch />
            </div>
        </header>
    );
}

export default Header;
