import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token'); 
        navigate('/sign'); 
    }, [navigate]);

    return <p>Saliendo...</p>; 
}

export default Logout;
