import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Arrow = ({ onClick, text, isRotated }) => {
    return (
        <div className="arrow" onClick={onClick}>
            <span>{text}</span>
            <MdKeyboardArrowDown className={isRotated ? 'rotated' : ''} />
        </div>
    );
};

export default Arrow;
