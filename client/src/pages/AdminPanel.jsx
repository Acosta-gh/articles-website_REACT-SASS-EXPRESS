import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function AdminPanel() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        content_thumbnail: '',
        image: '',
        categoryId: '',
    });

    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
    });

    const [categories, setCategories] = useState([]); // Para almacenar las categorías disponibles

    useEffect(() => {
        // Verificar si el usuario es admin
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (!decoded.isAdmin) {
                    console.log('No es admin', decoded);
                    window.location.href = '/';
                } else {
                    // Cargar las categorías disponibles
                    fetchCategories();
                }
            } catch (error) {
                console.error('Error al decodificar el token', error);
                window.location.href = '/';
            }
        } else {
            window.location.href = '/';
        }
    }, []);

    // Función para cargar las categorías desde la API
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/category/'); // Ajusta la URL de tu API
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error al cargar las categorías', error);
        }
    };

    // Manejar cambios en los campos del formulario de posts
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            
        });
    };

    // Manejar cambios en los campos del formulario de categorías
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData({
            ...categoryFormData,
            [name]: value,
        });
    };

    // Manejar el envío del formulario de posts
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const authorId = decoded.id; // Obtener el ID del usuario autenticado

        try {
            const response = await fetch('http://localhost:3000/post/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    author: authorId, // Asignar el ID del autor
                }),
            });

            if (response.ok) {
                alert('Post creado exitosamente');
                // Limpiar el formulario después de crear el post
                setFormData({
                    title: '',
                    content: '',
                    content_thumbnail: '',
                    image: '',
                    categoryId: '',
                });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al crear el post', error);
            alert('Error al crear el post');
        }
    };

    // Manejar el envío del formulario de categorías
    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/category/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: categoryFormData.name,
                }),
            });

            if (response.ok) {
                alert('Categoría creada exitosamente');
                // Limpiar el formulario después de crear la categoría
                setCategoryFormData({
                    name: '',
                });
                // Recargar la lista de categorías
                fetchCategories();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al crear la categoría', error);
            alert('Error al crear la categoría');
        }
    };

    return (
        <div>
            <h1>Panel de Administrador</h1>

            {/* Formulario para crear posts */}
            <h2>Crear Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Contenido:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />  [name]
                </div>
                <div>
                    <label>Miniatura del contenido:</label>
                    <input
                        type="text"
                        name="content_thumbnail"
                        value={formData.content_thumbnail}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Imagen (opcional):</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Categoría:</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Crear Post</button>
            </form>

            {/* Formulario para crear categorías */}
            <h2>Crear Categoría</h2>
            <form onSubmit={handleCategorySubmit}>
                <div>
                    <label>Nombre de la categoría:</label>
                    <input
                        type="text"
                        name="name"
                        value={categoryFormData.name}
                        onChange={handleCategoryChange}
                        required
                    />
                </div>
                <button type="submit">Crear Categoría</button>
            </form>
        </div>
    );
}

export default AdminPanel;