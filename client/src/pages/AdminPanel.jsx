import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function AdminPanel() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        content_highligth: '',
        image: '',
        categoryId: '',
    });

    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
    });

    const [categories, setCategories] = useState([]); // Para almacenar las categorías disponibles
    const [posts, setPosts] = useState([]); // Para almacenar los posts disponibles
    const [editingPost, setEditingPost] = useState(null); // Para almacenar el post a editar

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
                 
                    fetchCategories();
                    fetchPosts();
                }
            } catch (error) {
                console.error('Error al decodificar el token', error);
                window.location.href = '/';
            }
        } else {
            window.location.href = '/';
        }
    }, []);

    
    // función para cargar las categorías desde la API
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/category/'); // ajusta la URL de una API
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error al cargar las categorías', error);
        }
    };

    //Función para obtener los posts creados anteriormente
    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:3000/post/") // 
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            console.error(err)
        }
    }

    const deletePost = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este post?")) return;
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(`http://localhost:3000/post/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== id));
            } else {
                window.error("Error al eliminar el post");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const handleEdit = (post) => {
        setFormData({
            title: post.title,
            content: post.content,
            content_highligth: post.content_highligth,
            image: post.image || '',
            categoryId: post.categoryId,
        });
        setEditingPost(post); // Establecer el post que se está editando
    };

    // Manejar cambios en los campos del formulario de posts
    const handleChange = (e) => {
        const { name, value } = e.target; //Obtenmos name de los inputs
        setFormData({
            ...formData,
            [name]: value //De  esta manera la función handle change será dinamica para todos los inputs por igual
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

        const url = editingPost ? `http://localhost:3000/post/${editingPost.id}` : 'http://localhost:3000/post/';
        const method = editingPost ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
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
                const newPost = await response.json(); // Obtener los datos del nuevo post
                alert(editingPost ? 'Post actualizado exitosamente' : 'Post creado exitosamente');

                // Limpiar el formulario después de crear o editar el post
                setFormData({
                    title: '',
                    content: '',
                    content_highligth: '',
                    image: '',
                    categoryId: '',
                });

                // Actualizar la lista de posts
                if (editingPost) {
                    setPosts(posts.map(post => post.id === newPost.id ? newPost : post)); // Actualizar el post editado
                } else {
                    setPosts((prevPosts) => [newPost, ...prevPosts]); // Agregar el nuevo post
                }

                setEditingPost(null); // Limpiar el post en edición
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al crear o editar el post', error);
            alert('Error al crear o editar el post');
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
            <h2>{editingPost ? 'Editar Post' : 'Crear Post'}</h2>
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
                    <label>Texto Destacado:</label>
                    <input
                        type="text"
                        name="content_highligth"
                        value={formData.content_highligth}
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
                <button type="submit">{editingPost ? 'Editar Post' : 'Crear Post'}</button>
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
            <hr></hr>
            <h2>Posts Creados Anteriormente</h2>
            <ul>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content_highligth}</p>
                            <button onClick={() => handleEdit(post)}>Editar</button>
                            <button onClick={() => deletePost(post.id)}>X</button>
                        </li>
                    ))
                ) : (
                    <p>No hay posts disponibles.</p>
                )}
            </ul>
        </div>
    );
}

export default AdminPanel;