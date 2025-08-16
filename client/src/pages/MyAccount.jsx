import React, { useEffect, useState, useRef } from 'react';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

// Contexto de autenticación
import { useAuth } from "../context/AuthContext";

// Componentes
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import LoadingScreen from "../components/LoadingScreen"

//Services (TODO: Cambiar a Hook)
import { fetchBookmarks } from '../services/bookmarkService';

// Hooks
import { useSearchContext } from "../context/SearchContext";
import { useUser } from '../hooks/useUser';
import { useCategories } from '../hooks/useCategories';
import { useDropdown } from "../hooks/useDropdown";
import { usePosts } from '../hooks/usePosts';

const POSTS_PER_PAGE = 10;
const API = import.meta.env.VITE_API_URL;

/**
 * Página de cuenta de usuario ("MyAccount").
 * Permite ver y editar datos de perfil, gestionar posts guardados/bookmarks,
 * filtrar y paginar posts, y acceder al panel de admin si corresponde.
 */
function MyAccount() {
  // Estados de filtro y formularios
  const { searchTerm } = useSearchContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ name: '' });
  const [file, setFile] = useState(null);

  // Filtros de posts
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');

  // Flags de edición de perfil
  const [isEditing, setIsEditing] = useState(false);

  // Hooks de posts, usuario, categorías y dropdowns
  const { posts, setPosts, isLoading, error: postsError } = usePosts();
  const { userInfo, loading, error: userError, fetchUser, updateUser } = useUser();
  const { categories, setCategories } = useCategories();
  const {
    dropdownRefs,
    showDropdown,
    rotation,
    toggleDropdown,
    closeAllDropdowns,
  } = useDropdown(["category", "order"]);

  // Ref para input de archivo de perfil
  const fileInputRef = useRef(null);

  // Auth context
  const { user, isAuthenticated, logout } = useAuth();

  // Estado admin
  const isAdmin = Boolean(user?.isAdmin);

  // Carga inicial: verifica login, roles, carga bookmarks, categorías y usuario
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.replace('/sign');
      return;
    }
    loadCategories();
    loadBookmarks();
    fetchUser();
    // Cierra dropdowns si se clickea fuera
    const cleanup = setupOutsideClick(dropdownRefs, closeAllDropdowns);
    return cleanup;
    // eslint-disable-next-line
  }, [isAuthenticated, fetchUser]);

  // Carga categorías desde backend
  const loadCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (err) {
      console.log("Error fetching Categories:", err)
    }
  }

  // Carga bookmarks/posts guardados del usuario
  const loadBookmarks = async () => {
    try {
      if (!user?.id) return;
      // fetchBookmarks espera un token, pero ahora lo tienes en el AuthContext
      const data = await fetchBookmarks(localStorage.getItem("token"));
      setPosts(data)
    } catch (err) {
      console.log("Error fetching Posts:", err)
    }
  }

  // Filtra y ordena posts según filtros/búsqueda
  const getFilteredSortedPosts = () => {
    const categoryMap = categories.reduce((map, c) => ({ ...map, [c.id]: c.name }), {});
    return (posts || [])
      .filter(post => {
        const categoryMatch = currentCategory === 'All' || categoryMap[post.categoryId] === currentCategory;
        const searchMatch = [post.title, post.content, post.author].some(
          field => typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt), dateB = new Date(b.createdAt);
        return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
      });
  };

  // Paginación de los posts filtrados
  const getCurrentPosts = () => {
    const filtered = getFilteredSortedPosts();
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filtered.slice(start, start + POSTS_PER_PAGE);
  };

  // Opciones de dropdown para filtros
  const dropdownItems = {
    category: ['All', ...categories.map(c => c.name)],
    order: ['Newest', 'Oldest'],
  };

  // Detectar clicks fuera de los dropdowns para cerrarlos
  const setupOutsideClick = (refs, callback) => {
    const handleClickOutside = (event) => {
      const isOutside = Object.values(refs.current).every(
        ref => ref && !ref.contains(event.target)
      );
      if (isOutside) callback();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  };

  // Handlers de UI y formularios
  const handleSelect = (type, value) => {
    if (type === 'category') setCurrentCategory(value);
    if (type === 'order') setCurrentOrder(value);
    closeAllDropdowns();
  };

  const handleLogout = () => {
    logout();
    window.location.replace('/sign');
  }

  const handleIsEditing = () => {
    setIsEditing(prevState => !prevState)
    console.log(isEditing)
  }

  // Enviar formulario de edición de usuario (nombre e imagen)
  const handleSubmit = async e => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    if (file) formDataToSend.append('image', file);

    const data = await updateUser(formDataToSend);
    if (!data) {
      alert('Error updating user');
      return;
    }
    if (data.token) {
      // Usa el método del contexto para actualizar el token
      window.localStorage.setItem('token', data.token);
      window.location.reload();
    }
    setFormData({ name: '' });
    alert("User updated");
    setIsEditing(false);
  };

  if (!isAuthenticated || loading) return <LoadingScreen />;
  if (userError) return <div>Error: {userError.message}</div>;
  if (postsError) return <div>Error: {postsError.message}</div>;

  return (
    <Fade triggerOnce duration={500}>
      <div className='myaccount'>
        {/* Perfil de usuario */}
        <div className="myaccount-profile">
          <div className="profile-avatar">
            <img src={userInfo?.image ? `${API}/uploads/profiles/${userInfo.image}` : ''} alt="" />
          </div>
          <span className="line-divider">My Profile</span>
          <div className="myaccount-profile__info">
            <h1 id="username">{userInfo?.name || 'Anonymous'}</h1>
            <p id="bio">{userInfo?.email || 'Loading...'}</p>
          </div>

          <div className='myaccount-profile__actions'>
            <button className='button btn btn-outline' onClick={handleIsEditing}>
              {/* Edit user */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
              </svg> Edit User
            </button>
            <button className='button btn btn-danger btn-outline' onClick={handleLogout}>
              {/* Logout */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
              </svg>Logout
            </button>
            {isAdmin && <button className='btn btn-secondary btn-outline'><Link to='/adminpanel'>Admin Panel</Link> </button>}
          </div>

          {/* Formulario edición de usuario */}
          <div className='myaccount-profile__edit'>
            {isEditing && (
              <Fade triggerOnce duration={500}>
                <form onSubmit={handleSubmit} className='myaccount-profile__edit-form'>
                  <div>
                    <label>New Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={e => setFormData({ name: e.target.value })} />
                  </div>
                  <div>
                    <label>New Profile Picture:</label>
                    <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files[0])} accept="image/*" />
                  </div>
                  <button className='btn btn-confirm btn-outline' type="submit">
                    Confirm Changes
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                    </svg>
                  </button>
                </form>
              </Fade>
            )}
          </div>
        </div>

        {/* Bookmarks y filtros */}
        <h5 className='myaccount__subtitle'>My Bookmarks</h5>

        <div className='myaccount__filters'>
          {['category', 'order'].map(type => (
            <div key={type} className='dropdown' ref={el => dropdownRefs.current[type] = el}>
              <Arrow
                text={type === 'category' ? currentCategory : currentOrder}
                onClick={() => toggleDropdown(type)}
                isRotated={rotation[type]}
              />
              <div className={`dropdown__menu ${showDropdown[type] ? 'dropdown__menu-show' : ''}`}>
                {dropdownItems[type]
                  .filter(item => item !== (type === 'category' ? currentCategory : currentOrder))
                  .map((item, idx) => (
                    <div key={idx} onClick={() => handleSelect(type, item)} className='dropdown__item'>
                      {item}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Lista de posts paginados */}
        <div className='myaccount__posts'>
          <Fade triggerOnce duration={700}>
            {getCurrentPosts().length > 0 ? (
              getCurrentPosts().map(post => (
                <Post
                  key={post.id}
                  index={post.id}
                  image={post.image ? `${API}/uploads/posts/${post.image}` : null}
                  title={post.title}
                  content={post.content}
                  content_highlight={post.content_highligth}
                  author={post.authorUser?.name || "Unknown"}
                  date={post.createdAt}
                  categoryId={post.categoryId}
                />
              ))
            ) : (
              <div className='myaccount__no-posts'>
                <p>No posts found matching your search criteria.</p>
              </div>
            )}
          </Fade>
        </div>
        <Pagination
          postsPerPage={POSTS_PER_PAGE}
          length={getFilteredSortedPosts().length}
          handlePagination={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </Fade>
  );
};

export default MyAccount;