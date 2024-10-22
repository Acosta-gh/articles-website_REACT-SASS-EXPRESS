import React, { useState, useEffect, useRef } from 'react';
import Hamburger from 'hamburger-react';
import { Link } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { FaBlog } from "react-icons/fa6";
import Arrow from "./Arrow";

function Header() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isBurguerOpen, setBurguerOpen] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isRotated, setIsRotated] = useState(false);

    const searchRef = useRef(null);
    const iconRef = useRef(null);
    const navRef = useRef(null); // Referencia para el menú
    const navIconMenuRef = useRef(null); // Referencia para el icono del menú
    const navIconBurguerRef = useRef(null);

    const toggleNav = () => {
        setMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const handleArrowClick = () => {
        setIsRotated(prev => !prev);
        toggleNav();
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target) &&
                navRef.current && !navRef.current.contains(event.target) &&
                navIconBurguerRef.current && !navIconBurguerRef.current.contains(event.target) &&
                navIconMenuRef.current && !navIconMenuRef.current.contains(event.target) 
            ) {
                setIsSearchVisible(false);
                setMenuOpen(false); 
                setIsRotated(false); 
                setBurguerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className={`header ${isAtTop ? 'at-top' : 'fixed'}`}>
            <div className='header-burguer' onClick={toggleNav} ref={navIconBurguerRef}>
                <Hamburger toggled={isBurguerOpen} toggle={setBurguerOpen} size={25} />
            </div>

            <div className={`header-burguer_desktop`} ref={navIconMenuRef}>
                <Arrow onClick={handleArrowClick} text="Menu" isRotated={isRotated} /> 
            </div>

            <nav className={`header-nav ${isMenuOpen ? 'visible' : ''}`} ref={navRef}>
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
