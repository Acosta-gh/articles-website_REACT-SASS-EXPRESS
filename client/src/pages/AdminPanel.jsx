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
                    alert('Expired Token');
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
        if (!window.confirm("Are you sure you want to delete this post?")) return;
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
        const result = confirm(`Do you want to edit ${category.name}?`);
        if (result) {
            const name = prompt("What's the new category's name?", category.name);
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

                    alert("Category updated!");
                } catch (error) {
                    console.error("Error:", error);
                    alert("Error while updating the category");
                }
            } else {
                alert("You must type a name");
            }
        } else {
            alert("Cancelled.");
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
                alert(editingPost ? 'Post updated!' : 'Post created!');

                setFormData({
                    title: '',
                    content: '',
                    content_highligth: '',
                    categoryId: '',
                });

                setFile(null); // Limpiar la imagen seleccionada

                fetchPosts(); // Actualizamos la lista de posts 

                setEditingPost(null);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al crear o editar el post', error);
            alert('Error while updating/creating the post');
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
                alert('Category created!');

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
            alert('Error while creating the category');
        }
    };

    return (
        <div className='adminpanel'>
            <section className='admin-panel__create-post'>
                <h1>Admin Panel</h1>
                {/* Formulario para crear posts */}
                <h2>{editingPost ? 'Edit Post' : 'Create Post'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Content: (Markdown)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Featured Content (Markdown) (Summary):</label>
                        <textarea
                            type="text"
                            name="content_highligth"
                            value={formData.content_highligth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Image Banner:</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFile}
                            accept="image/*"
                        />
                    </div>
                    <div>
                        <label>Category:</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className='button' type="submit">{editingPost ? 'Edit Post' : 'Create Post'}</button>
                </form>
            </section>
            {/* Formulario para crear categorías */}
            <section className='admin-panel__create-category'>
                <h2>Create Category</h2>
                <form onSubmit={handleCategorySubmit}>
                    <div>
                        <label>Category name:</label>
                        <input
                            type="text"
                            name="name"
                            value={categoryFormData.name}
                            onChange={handleCategoryChange}
                            required
                        />
                    </div>
                    <button className='button' type="submit">Create Category</button>
                </form>
            </section>
            <hr></hr>
            {/* Lista posts en la DB */}
            <h2>Previously created posts</h2>
            <section className='admin-panel__post-list'>
                <div className="admin-panel__posts-container">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const imageUrl = post.image ? `http://localhost:3000/uploads/${post.image}` : null;
                            return (
                                <div key={post.id} className="admin-panel__post-card">
                                    {imageUrl && <img src={imageUrl} alt={post.title} className="admin-panel__post-image" />}
                                    <h3>{post.title}</h3>
                                    <p>{post.content_highligth}</p>
                                    <i>{categories.find(category => category.id === post.categoryId)?.name}</i>
                                    <div className="admin-panel__button-container">
                                        <button className='button' onClick={() => handleEditPost(post)}>Edit</button>
                                        <button className='button' onClick={() => deletePost(post.id)}>Delete</button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </section>
            {/* Lista Categorias en la DB */}
            <section className='admin-panel__category-list'>
                <h3>Previously created categories</h3>
                <div className="admin-panel__categories-container">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="admin-panel__category-card">
                                <h4>{category.name}</h4>
                                <div className="admin-panel__button-container">
                                    <button className='button' onClick={() => handleEditCategory(category)}>Edit</button>
                                    <button className='button' onClick={() => deleteCategory(category.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No categories available</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;