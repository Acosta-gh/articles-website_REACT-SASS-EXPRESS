import React, { useState, useEffect, useRef } from 'react';
import Hamburger from 'hamburger-react';
import { Link } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { PiGitlabLogoSimpleFill } from "react-icons/pi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaBlog } from "react-icons/fa6";

function Header() {
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const searchRef = useRef(null);
    const iconRef = useRef(null);

    const toggleNav = () => {
        setIsNavVisible(!isNavVisible);
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    useEffect(() => { // Hides the search field if clicked outside. | Oculta el campo de búsqueda si se hace clic fuera de él; 
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

            <div className={`header-burguer_desktop`} onClick={toggleNav}>
                <p>Menu</p>
                <i className={`header-burguer_desktop-arrow ${isNavVisible ? 'rotated' : ''}`}>
                    <MdKeyboardArrowDown />
                </i>
            </div>

            <nav className={`header-nav ${isNavVisible ? 'visible' : ''}`}>
                <Link to="/articles" onClick={toggleNav}><p>Our Articles</p></Link>
                <Link to="/about" onClick={toggleNav}><p>About Us</p></Link>
                <Link to="/contact" onClick={toggleNav}><p>Contact Us</p></Link>
                <Link to="/account" onClick={toggleNav}><p>My Account</p></Link>
            </nav>
            <input
                ref={searchRef}
                className={`header-search ${isSearchVisible ? 'visible' : ''}`}
                type='text'
                placeholder='Search By...'
                maxLength={30} 
            />
            <a href="/" className='header-logo'>
            <FaBlog />
            </a>
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
