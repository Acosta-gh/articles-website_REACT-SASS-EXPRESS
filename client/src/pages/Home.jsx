import React, { useEffect, useState, useRef } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";

//const POSTS_PER_PAGE = 10;
//const API = "http://127.0.0.1:3000";

const Home = () => {
  // Obtenemos el término de búsqueda del contexto global
  const { searchTerm } = useSearchContext();

  // Estados para manejar datos y UI
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [showDropdown, setShowDropdown] = useState({ category: false, order: false });
  const [rotation, setRotation] = useState({ category: false, order: false });
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');

  // Refs para detectar clics fuera de los dropdowns
  const dropdownRefs = useRef({});

  useEffect(() => {
    fetchPosts(); // Carga los posts
    fetchCategories();// Carga las categorías
    setupOutsideClickListener();// Agrega listener para cerrar dropdowns al hacer clic fuera
    return cleanupOutsideClickListener; // Limpieza del listener
  }, []);

  // Función para obtener los posts desde el backend
  const fetchPosts = () => {
    fetch('http://localhost:3000/post/')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error fetching posts:", err));
  };

  // Función para obtener las categorías desde el backend
  const fetchCategories = () => {
    fetch('http://localhost:3000/category/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  };

  // Listener para detectar clics fuera de los dropdowns
  const setupOutsideClickListener = () => {
    const handleClickOutside = (event) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        ref => ref && !ref.contains(event.target)
      );
      if (isOutside) {
        closeAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
  };

  // Limpia el event listener al desmontar el componente
  const cleanupOutsideClickListener = () => {
    document.removeEventListener('mousedown', setupOutsideClickListener);
  };

  // Cierra todos los dropdowns y reinicia su rotación
  const closeAllDropdowns = () => {
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };

  const toggleDropdown = (type) => {
    const newVisibility = !showDropdown[type];
    setShowDropdown({ category: false, order: false, [type]: newVisibility });
    setRotation({ category: false, order: false, [type]: newVisibility });
  };

  // Manejador para cuando el usuario selecciona una opción del dropdown
  const handleSelect = (type, value) => {
    if (type === 'category') setCurrentCategory(value);
    if (type === 'order') setCurrentOrder(value);
    closeAllDropdowns();
  };

  // Filtra y ordena los posts de acuerdo a la búsqueda, categoría y orden
  const getFilteredSortedPosts = () => {
    // Crea un mapa para acceder al nombre de la categoría a partir de su ID
    // Ejemplo: { 1: "Tech", 2: "Science" }
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});

    // Filtra los posts según la categoría actual y el término de búsqueda
    const filtered = posts.filter(post => {
      // Obtiene el nombre de la categoría del post actual
      const categoryName = categoryMap[post.categoryId] || '';

      // Verifica si el post coincide con la categoría seleccionada
      const matchesCategory = currentCategory === 'All' || categoryName === currentCategory;

      // Verifica si el término de búsqueda aparece en el título, contenido o autor
      const matchesSearch = [post.title, post.content, post.author].some(field =>
        typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Retorna true si el post coincide tanto con la categoría como con el término de búsqueda
      return matchesCategory && matchesSearch;
    });

    // Ordena los posts filtrados por fecha de creación
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      // Si el orden actual es 'Newest', muestra primero los más recientes
      // Si es 'Oldest', muestra primero los más antiguos
      return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });
  };


  // Devuelve los posts de la página actual
  const getCurrentPosts = () => {
    const sorted = getFilteredSortedPosts();
    const start = (currentPage - 1) * postsPerPage;
    return sorted.slice(start, start + postsPerPage);
  };

  // Retorna saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 👋";
    if (hour < 17) return "Good Afternoon 🌇";
    return "Good Evening 🌆";
  };

  // Opciones para los dropdowns
  const dropdownItems = {
    category: ['All', ...categories.map(c => c.name)],
    order: ['Newest', 'Oldest']
  };

  // Renderizado del componente principal
  return (
    <div className='home'>
      <Fade triggerOnce duration={1500}>
        <Slide triggerOnce duration={900}>
          <div className='home__greetings'>
            <p>{getGreeting()}</p>
            <h1>Posts-Worthy Reads</h1>
            <i>Stories to Inspire Your Thoughts</i>
          </div>
        </Slide>
      </Fade>

      <div className='home__filters'>
        {['category', 'order'].map(type => (
          <div
            key={type}
            className='dropdown'
            ref={el => dropdownRefs.current[type] = el}
          >
            <Arrow
              text={type === 'category' ? currentCategory : currentOrder}
              onClick={() => toggleDropdown(type)}
              isRotated={rotation[type]}
            />
            <div className={`dropdown__menu ${showDropdown[type] ? 'dropdown__menu-show' : ''}`}>
              {dropdownItems[type]
                .filter(item => item !== (type === 'category' ? currentCategory : currentOrder))
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(type, item)}
                    className='dropdown__item'
                  >
                    {item}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className='home__posts'>
        <Fade triggerOnce duration={700}>
          {getCurrentPosts().length > 0 ? (
            getCurrentPosts().map(post => (
              <Post
                key={post.id}
                index={post.id}
                image={post.image ? `http://localhost:3000/uploads/${post.image}` : null}
                title={post.title}
                content={post.content}
                content_highlight={post.content_highligth}
                author={post.authorUser?.name || "Unknown"}
                date={post.createdAt || new Date().toISOString()}
                categoryId={post.categoryId}
                loading={loading}
              />
            ))
          ) : (
            <div className='home__no-posts'>
              <p>No posts found matching your search criteria.</p>
            </div>
          )}
        </Fade>
      </div>

      <Pagination
        postsPerPage={postsPerPage}
        length={getFilteredSortedPosts().length}
        handlePagination={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Home;
