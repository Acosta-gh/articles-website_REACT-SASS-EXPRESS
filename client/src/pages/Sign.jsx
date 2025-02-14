import React, { useState, useEffect } from 'react';

function LoginSignup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [inOrUp, setInOrUp] = useState("in"); // "in" para iniciar sesión, "up" para registrarse

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/profile';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = inOrUp === "in" ? 'http://localhost:3000/user/login' : 'http://localhost:3000/user/register';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/profile';
            } else {
                setError(data.message || 'Error en el proceso');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    const toggleInOrUp = () => {
        setInOrUp(prev => (prev === "in" ? "up" : "in"));
        setEmail(''); 
        setPassword('');
        setError(''); 
    };

    return (
        <div>
            <h2>{inOrUp === "in" ? "Iniciar sesión" : "Registrarse"}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">{inOrUp === "in" ? "Iniciar sesión" : "Registrarse"}</button>
            </form>
            <p onClick={toggleInOrUp} style={{ cursor: 'pointer', color: 'blue' }}>
                {inOrUp === "in" ? "¿No tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia sesión"}
            </p>
        </div>
    );
}

export default LoginSignup;
