import React, { useState, useEffect, useRef } from 'react';
import Hamburger from 'hamburger-react';
import { Link } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { FaBlog } from "react-icons/fa6";
import Arrow from "./Arrow";
import { useSearchContext } from '../context/SearchContext';
import NavLinks from './NavLinks';

const Header = () => {
    const { searchTerm, setSearchTerm } = useSearchContext();
    const [state, setState] = useState({
        isMenuOpen: false,
        isSearchVisible: false,
        isAtTop: true,
        isRotated: false,
    });
    const [isOpen, setOpen] = useState(false); // Estado separado para el menú hamburguesa
    const searchRef = useRef(null);
    const headerRef = useRef(null);

    const headerLinks = ['Our Articles', 'About Us', 'Contact Us', 'My Account'];

    const toggleState = (key) => {
        setState((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const closeAll = () => {
        setState((prev) => ({
            ...prev,
            isMenuOpen: false,
            isSearchVisible: false,
            isRotated: false,
        }));
        setOpen(false); // Cierra el menú hamburguesa al cerrar todo
    };

    const handleScroll = () => {
        setState((prev) => ({ ...prev, isAtTop: window.scrollY === 0 }));
    };

    const handleClickOutside = (event) => {
        if (headerRef.current && !headerRef.current.contains(event.target)) {
            closeAll();
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header ref={headerRef} className={`header ${state.isAtTop ? 'at-top' : 'fixed'}`}>
            <div
                className='header-burguer'
                onClick={() => {
                    setOpen(!isOpen);
                    toggleState('isMenuOpen');
                }}
            >
                <Hamburger toggled={isOpen} toggle={setOpen} size={25} />
            </div>

            <div className='header-burguer_desktop'>
                <Arrow 
                    onClick={() => { 
                        toggleState('isMenuOpen'); 
                        toggleState('isRotated'); 
                    }} 
                    text="Menu" 
                    isRotated={state.isRotated} 
                />
            </div>

            <nav className={`header-nav ${state.isMenuOpen ? 'visible' : ''}`}>
                <NavLinks links={headerLinks} onClick={closeAll} />
            </nav>

            <Link to="/" className='header-logo'>
                <FaBlog />
            </Link>

            <input
                ref={searchRef}
                className={`header-search ${state.isSearchVisible ? 'visible' : ''}`}
                type='text'
                placeholder='Search By...'
                maxLength={30}
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <div className='header-search_icon' onClick={() => toggleState('isSearchVisible')}>
                <LuSearch />
            </div>
        </header>
    );
}

export default Header;
