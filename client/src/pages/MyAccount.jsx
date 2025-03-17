import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
     
      navigate('/logout');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded); 
    } catch (error) {
   
      navigate('/logout');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/logout'); 
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Si el usuario es admin, mostrar el botón de Admin Panel */}
      {user.isAdmin && (
        <button onClick={() => navigate('/adminpanel')}>Ir al Panel de Admin</button>
      )}

      {/* Botón de logout para todos los usuarios */}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Profile;
