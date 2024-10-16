import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Arrow = ({ onClick, text }) => {
    const [isRotated, setIsRotated] = useState(false);

    const handleClick = () => {
        setIsRotated(prev => !prev); // Cambia el estado de rotación
        if (onClick) {
            onClick(); // Llama al callback si se proporciona
        }
    };

    return (
        <div className="arrow" onClick={handleClick}>
            <span >{text}</span>
            <MdKeyboardArrowDown className={isRotated ? 'rotated' : ''} />
        </div>
    );
};

export default Arrow;
