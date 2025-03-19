import React, { useState, useEffect } from 'react';

function LoginSignup() {
    const [name, setName] = useState(''); // Nuevo estado para el nombre
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [inOrUp, setInOrUp] = useState("in"); // "in" para iniciar sesión, "up" para registrarse

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/myaccount';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = inOrUp === "in"
            ? 'http://localhost:3000/user/login'
            : 'http://localhost:3000/user/register';

        const bodyData = inOrUp === "in"
            ? { email, password }
            : { name, email, password }; // Enviar 'name' solo si se está registrando

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);

                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                window.location.href = '/myaccount';
            } else {
                setError(data.error || 'Error en el proceso');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    //Verifica si nos estamos registrando o logeando, mi intento de hacer un dos en uno.
    const toggleInOrUp = () => {
        setInOrUp(prev => (prev === "in" ? "up" : "in"));
        setName('');
        setEmail('');
        setPassword('');
        setError('');
    };

    return (
        <div className={`sign sign--${inOrUp}`}>
            <h2>{inOrUp === "in" ? "Log in" : "Sign up"}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className='sign__form'>
                {inOrUp === "up" && (
                    <div className='sign__form-section'>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
                <div className='sign__form-section'>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='sign__form-section'>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">
                    {inOrUp === "in" ? "Sign in" : "Register"}
                </button>
            </form>
            <p onClick={toggleInOrUp} style={{ cursor: 'pointer', color: 'blue' }}>
                {inOrUp === "in" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </p>
        </div>
    );
}

export default LoginSignup;
