import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

function AdminPanel() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        content_highligth: '',
        categoryId: '',
    });

    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
    });

    const [categories, setCategories] = useState([]); // Para almacenar las categorías disponibles
    const [posts, setPosts] = useState([]); // Para almacenar los posts disponibles
    const [editingPost, setEditingPost] = useState(null); // Para almacenar el post a editar

    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        // Verificar si el usuario es admin
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp && decoded.exp < currentTime) {
                    alert('Token expirado');
                    window.location.href = '/logout';
                    return;
                }

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
            const response = await fetch("http://localhost:3000/post/") // ajusta la URL de una API
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
            const response = await fetch(`http://localhost:3000/post/${id}`, { // ajusta la URL de una API
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

    const handleEditPost = (post) => {
        setFormData({
            title: post.title,
            content: post.content,
            content_highligth: post.content_highligth,
            categoryId: post.categoryId,
        });
        setFile(null); // Limpiar la imagen seleccionada
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Limpiar el input file
        }
        setEditingPost(post);
    };

    const handleEditCategory = async (category) => {
        const result = confirm(`¿Deseas editar ${category.name}?`);
        if (result) {
            const name = prompt("¿Cuál es el nuevo nombre de la categoría?", category.name);
            if (name) {
                try {
                    const response = await fetch(`http://localhost:3000/category/${category.id}`, { // ajusta la URL de una API
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name })
                    });

                    if (!response.ok) {
                        throw new Error("Error al actualizar la categoría");
                    }

                    setCategories((prevCategories) =>
                        prevCategories.map((cat) =>
                            cat.id === category.id ? { ...cat, name } : cat
                        )
                    );

                    alert("Categoría actualizada correctamente.");
                } catch (error) {
                    console.error("Error:", error);
                    alert("Hubo un problema al actualizar la categoría.");
                }
            } else {
                alert("Debes ingresar un nombre.");
            }
        } else {
            alert("Cancelaste.");
        }
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
        const authorId = decoded.id;

        const url = editingPost ? `http://localhost:3000/post/${editingPost.id}` : 'http://localhost:3000/post/'; // ajusta la URL de una API
        const method = editingPost ? 'PUT' : 'POST';

        // Crear FormData
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('content_highligth', formData.content_highligth);
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('author', authorId);

        if (file) {
            formDataToSend.append('image', file); // Agregar imagen si está presente
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend, // Enviar como FormData
            });

            if (response.ok) {
                const newPost = await response.json();
                alert(editingPost ? 'Post actualizado exitosamente' : 'Post creado exitosamente');

                setFormData({
                    title: '',
                    content: '',
                    content_highligth: '',
                    categoryId: '',
                });

                setFile(null); // Limpiar la imagen seleccionada

                if (editingPost) {
                    //setPosts(posts.map(post => post.id === newPost.id ? newPost : post));
                    fetchPosts();
                } else {
                    setPosts((prevPosts) => [newPost, ...prevPosts]);
                }

                setEditingPost(null);
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
            const response = await fetch('http://localhost:3000/category/', { // ajusta la URL de una API
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
        <div className='adminpanel'>
            <section className='adminpanel-create_post'>
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
                        <label>Contenido: (Markdown)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Contenido Destacado (Markdown) (Resumen):</label>
                        <textarea
                            type="text"
                            name="content_highligth"
                            value={formData.content_highligth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Imagen Banner:</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFile}
                            accept="image/*"
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
                    <button className='button' type="submit">{editingPost ? 'Editar Post' : 'Crear Post'}</button>
                </form>
            </section>
            {/* Formulario para crear categorías */}
            <section className='adminpanel-create_category'>
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
                    <button className='button' type="submit">Crear Categoría</button>
                </form>
            </section>
            <hr></hr>
            {/* Lista posts en la DB */}
            <h2>Posts Creados Anteriormente</h2>
            <section className='adminpanel-list_posts'>
                <div className="posts-container">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const imageUrl = post.image ? `http://localhost:3000/uploads/${post.image}` : null;
                            return (
                                <div key={post.id} className="post-card">
                                    {imageUrl && <img src={imageUrl} alt={post.title} className="post-image" />}
                                    <h3>{post.title}</h3>
                                    <p>{post.content_highligth}</p>
                                    <i>{categories.find(category => category.id === post.categoryId)?.name}</i>
                                    <div className="button-container">
                                        <button className='button' onClick={() => handleEditPost(post)}>Editar</button>
                                        <button className='button' onClick={() => deletePost(post.id)}>Borrar</button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No hay posts disponibles.</p>
                    )}
                </div>
            </section>
            {/* Lista Categorias en la DB */}
            <section className='adminpanel-list_categories'>
                <h3>Categorías Creadas Anteriormente</h3>
                <div className="categories-container">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="category-card">
                                <h4>{category.name}</h4>
                                <div className="button-container">
                                    <button className='button' onClick={() => handleEditCategory(category)}>Editar</button>
                                    <button className='button' onClick={() => deleteCategory(category.id)}>Borrar</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay categorías disponibles.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;