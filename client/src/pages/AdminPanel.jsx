import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

// Contexto de autenticación
import { useAuth } from "../context/AuthContext";

// Hooks para manejar posts y categorías vía API
import { useCategories } from '../hooks/useCategories';
import { usePosts } from '../hooks/usePosts';

const API = import.meta.env.VITE_API_URL;

/**
 * Panel de administración para gestionar Posts y Categorías.
 * Permite CRUD de posts y categorías, y subir imágenes asociadas a los posts.
 * Solo accesible para usuarios admin.
 */
function AdminPanel() {
    // Estados para formularios y edición
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        content_highligth: '',
        categoryId: '',
    });
    const [categoryFormData, setCategoryFormData] = useState({ name: '' });
    const [editingPost, setEditingPost] = useState(null);
    const [banner, setBanner] = useState(null);         // Imagen principal del post
    const [file, setFile] = useState(null);             // Imagen para el contenido

    // Contexto de auth
    const { user, isAuthenticated } = useAuth();

    // Hooks personalizados (los hooks manejan carga inicial y estado)
    const {
        posts, isLoading, error: postsError,
        create, update, remove, uploadImage
    } = usePosts();

    const {
        categories, isLoading: categoriesLoading, error: categoriesError,
        create: createCategory, update: updateCategory, remove: deleteCategory
    } = useCategories();

    // Refs para inputs de archivos
    const bannerInputRef = useRef(null);
    const imageInputRef = useRef(null);

    // Solo permite acceso a admin autenticado
    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) {
            window.location.href = '/';
        }
    }, [isAuthenticated, user]);

    // Elimina un post
    const handleDeletePost = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        await remove(id);
    };

    // Carga post en formulario para editar
    const handleEditPost = (post) => {
        alert("Post has been loaded for editing");
        setFormData({
            title: post.title,
            content: post.content,
            content_highligth: post.content_highligth,
            categoryId: post.categoryId,
        });
        setBanner(null);
        if (bannerInputRef.current) bannerInputRef.current.value = '';
        setEditingPost(post);
    };

    // Editar nombre de una categoría
    const handleEditCategory = async (category) => {
        const result = confirm(`Do you want to edit ${category.name}?`);
        if (result) {
            const name = prompt("What's the new category's name?", category.name);
            if (name) {
                await updateCategory(category.id, { name });
                alert("Category updated!");
            } else {
                alert("You must type a name");
            }
        }
    };

    // Elimina una categoría
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        await deleteCategory(id);
        alert("Category deleted!");
    };

    // Maneja cambios en form de post
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja cambios en form de categoría
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData({
            ...categoryFormData,
            [name]: value,
        });
    };

    // Sube imagen para insertar en el contenido del post (markdown)
    const handleUploadPicture = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            alert('Your session has expired. Please log in again.');
            setTimeout(() => {
                window.location.replace('/logout');
            }, 1500);
            return;
        }
        if (!file) {
            alert("No file selected");
            return;
        }
        const data = await uploadImage(file, 'posts');
        if (data) {
            setFormData(prevFormData => ({
                ...prevFormData,
                content: prevFormData.content + '\n' + data.markdown
            }));
            setFile(null);
            imageInputRef.current.value = null;
        } else {
            alert("Error uploading image");
        }
    };

    // Crea o edita post
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("User not authenticated.");
            return;
        }
        const authorId = user.id;

        const postData = {
            title: formData.title,
            content: formData.content,
            content_highligth: formData.content_highligth,
            categoryId: formData.categoryId,
            author: authorId
        };

        try {
            let ok;
            if (editingPost) {
                ok = await update(editingPost.id, postData, banner);
            } else {
                ok = await create(postData, banner);
            }

            if (!ok) {
                alert('Error while updating/creating the post');
                return;
            }

            alert(editingPost ? 'Post updated!' : 'Post created!');
            setFormData({
                title: '',
                content: '',
                content_highligth: '',
                categoryId: '',
            });
            setBanner(null);
            if (bannerInputRef.current) bannerInputRef.current.value = '';
            setEditingPost(null);

        } catch (error) {
            console.error('Error al crear o editar el post', error);
            alert('Error while updating/creating the post');
        }
    };

    // Crea una nueva categoría
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const ok = await createCategory(categoryFormData);
            if (ok) {
                alert('Category created!');
                setCategoryFormData({ name: '' });
            }
        } catch (error) {
            console.error('Error al crear la categoría', error);
            alert('Error while creating the category');
        }
    };

    // Render - JSX
    return (
        <div className='adminpanel'>
            {/* Formulario para crear/editar posts */}
            <section className='admin-panel__create-post'>
                <Link to="/myaccount" className="btn btn-outline btn-secondary">
                    Go Back
                    {/* Icono de flecha */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                </Link>
                <h1 className='title'>Admin Panel</h1>
                <h2 className='subtitle'>{editingPost ? 'Edit Post' : 'Create Post'}</h2>
                <div className="admin__panel__grid">
                    {/* Formulario para crear/editar posts */}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className='paragraph'>{editingPost ? 'Banner: (Leave blank if you want to keep the same) ' : 'Banner: '}</label>
                            <input
                                type="file"
                                ref={bannerInputRef}
                                onChange={(e) => setBanner(e.target.files[0])}
                                accept="image/*"
                            />
                        </div>
                        <div>
                            <label className='paragraph'>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength={149}
                            />
                        </div>
                        <div>
                            <label className='paragraph'>Content: (Markdown)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                maxLength={9999}
                            />
                        </div>
                        <div>
                            <label className='paragraph'>Featured Content (Summary):</label>
                            <textarea
                                type="text"
                                name="content_highligth"
                                value={formData.content_highligth}
                                onChange={handleChange}
                                required
                                maxLength={149}
                            />
                        </div>
                        <div>
                            <label className='paragraph'>Category:</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option className='paragraph'>Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className='btn btn-confirm btn-outline' type="submit">
                            {editingPost ? 'Edit Post' : 'Create Post'}
                            {/* Icono check */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                            </svg>
                        </button>
                    </form>
                    {/* Formulario para subir imágenes al contenido */}
                    <div>
                        <p className='paragraph'>Upload a picture to use in your post:</p>
                        <form onSubmit={handleUploadPicture}>
                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button className="btn btn-confirm btn-outline" type="submit">
                                Upload
                                {/* Icono upload */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            {/* Formulario para crear categoría */}
            <section className='admin-panel__create-category'>
                <h2 className='subtitle'>Create Category</h2>
                <form onSubmit={handleCategorySubmit}>
                    <div>
                        <label className='paragraph'>Category name:</label>
                        <input
                            type="text"
                            name="name"
                            value={categoryFormData.name}
                            onChange={handleCategoryChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <button className='btn btn-confirm btn-outline' type="submit">
                        Create Category
                        {/* Icono check */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </svg>
                    </button>
                </form>
            </section>

            <hr />
            {/* Listado de posts */}
            <h2 className='subtitle'>Previously created posts</h2>
            <section className='admin-panel__post-list'>
                <div className="admin-panel__posts-container">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const imageUrl = post.image ? `${API}/uploads/posts/${post.image}` : null;
                            return (
                                <div key={post.id} className="admin-panel__post-card">
                                    {imageUrl && <img src={imageUrl} alt={post.title} className="admin-panel__post-image" />}
                                    <h3>{post.title}</h3>
                                    <p>{post.content_highligth}</p>
                                    <i>{categories.find(category => category.id === post.categoryId)?.name}</i>
                                    <div className="admin-panel__button-container">
                                        <button className='btn btn-secondary btn-outline' onClick={() => handleEditPost(post)}>
                                            Edit
                                            {/* Icono lápiz */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                            </svg>
                                        </button>
                                        <button className='btn btn-danger btn-outline' onClick={() => handleDeletePost(post.id)}>
                                            Delete
                                            {/* Icono basura */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className='paragraph'>No posts available</p>
                    )}
                </div>
            </section>
            {/* Listado de categorías */}
            <section className='admin-panel__category-list'>
                <h3 className='subtitle'>Previously created categories</h3>
                <div className="admin-panel__categories-container">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="admin-panel__category-card">
                                <h4 className='paragraph'>{category.name}</h4>
                                <div className="admin-panel__button-container">
                                    <button className='btn btn-secondary btn-outline' onClick={() => handleEditCategory(category)}>
                                        Edit
                                        {/* Icono lápiz */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                        </svg>
                                    </button>
                                    <button className='btn btn-danger btn-outline' onClick={() => handleDeleteCategory(category.id)}>
                                        Delete
                                        {/* Icono basura */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='paragraph'>No categories available</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;