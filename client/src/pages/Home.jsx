import React, { useEffect, useState, useRef } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";

const Home = () => {
  // Obtén el término de búsqueda del contexto de búsqueda
  const { searchTerm } = useSearchContext();

  // Estados para almacenar los posts, el estado de carga, la página actual, etc.
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Número de posts por página
  const [showDropdown, setShowDropdown] = useState({ category: false, order: false });
  const [rotation, setRotation] = useState({ category: false, order: false });
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');
  const dropdownRefs = useRef({}); // Referencias para los dropdowns

  // Efecto para obtener los posts y las categorías al montar el componente
  useEffect(() => {
    // Obtener los posts desde la API
    fetch('http://localhost:3000/post/')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Error fetching posts:", error));

    // Obtener las categorías desde la API
    fetch('http://localhost:3000/category/')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));

    // Manejar clics fuera de los dropdowns para cerrarlos
    const handleClickOutside = (event) => {
      const isOutsideClick = Object.keys(dropdownRefs.current).every(key => {
        const dropdown = dropdownRefs.current[key];
        return dropdown && !dropdown.contains(event.target);
      });
      if (isOutsideClick) {
        setShowDropdown({ category: false, order: false });
        setRotation({ category: false, order: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para filtrar y ordenar los posts según la categoría y el término de búsqueda
  const filterAndSortPosts = () => {
    // Crear un mapa de categorías para acceder rápidamente a los nombres
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});

    return posts
      .filter(post => {
        const categoryName = categoryMap[post.categoryId];
        return (
          (currentCategory === 'All' || categoryName === currentCategory) &&
          [post.title, post.content, post.author].some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
      });
  };

  // Obtener los posts actuales según la página actual
  const currentPosts = filterAndSortPosts().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Función para alternar la visibilidad de los dropdowns
  const toggleDropdown = (type) => {
    setShowDropdown(prev => ({
      category: type === 'category' ? !prev.category : false,
      order: type === 'order' ? !prev.order : false
    }));
    setRotation(prev => ({
      category: type === 'category' ? !prev.category : prev.category,
      order: type === 'order' ? !prev.order : prev.order
    }));
  };

  // Función para manejar la selección de una opción en los dropdowns
  const handleSelect = (type, value) => {
    if (type === 'category') setCurrentCategory(value);
    else setCurrentOrder(value);
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };

  // Opciones disponibles en los dropdowns
  const dropdownItems = {
    category: ['All', ...categories.map(cat => cat.name)],
    order: ['Newest', 'Oldest']
  };

  // Función para obtener un saludo según la hora del día
  const getGreetings = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? "Good Morning!👋" :
      currentHour < 17 ? "Good Afternoon 🌇" : "Good Evening 🌆";
  };

  return (
    <div className='home'>
      {/* Animación de entrada para el saludo */}
      <Fade triggerOnce duration={1500}>
        <Slide triggerOnce duration={900}>
          <div className='home-greetings'>
            <p>{getGreetings()}</p>
            <h1>Posts-Worthy Reads</h1>
            <i>Stories to Inspire Your Thoughts</i>
          </div>
        </Slide>
      </Fade>

      {/* Dropdowns para filtrar por categoría y ordenar */}
      <div className='home-category'>
        {['category', 'order'].map(type => ( // Itera sobre los tipos de dropdowns: 'category' y 'order'
          <div
            className='dropdown'
            key={type} 
            ref={el => dropdownRefs.current[type] = el} // Referencia para manejar clics fuera del dropdown
          >
            {/* Componente Arrow: Representa el botón que abre/cierra el dropdown */}
            <Arrow
              text={type === 'category' ? currentCategory : currentOrder} // El texto de la flecha será categoría u orden
              onClick={() => toggleDropdown(type)} // Alterna la visibilidad del dropdown al hacer clic
              isRotated={rotation[type]} // Controla si la flecha está rotada (indica si el dropdown está abierto)
            />

            {/* Menú desplegable */}
            <div className={`dropdown-menu ${showDropdown[type] ? 'show' : ''}`}>
              {dropdownItems[type] // Accede a las opciones del dropdown (categorías u órdenes)
                .filter(item => item !== (type === 'category' ? currentCategory : currentOrder)) // Filtra la opción seleccionada actualmente
                .map((item, index) => ( // Itera sobre las opciones filtradas
                  <div
                    key={index} 
                    onClick={() => handleSelect(type, item)} // Maneja la selección de una opción
                    className="dropdown-item" // Estilo para cada opción del dropdown
                  >
                    {item} {/* Muestra el texto de la opción */}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de posts */}
      <div className='posts'>
        <Fade triggerOnce duration={700}>
          {currentPosts.length > 0 ? (
            currentPosts.map(data => (
              <Post
                key={data.id}
                index={data.id}
                image={data.image}
                title={data.title}
                content={data.content}
                content_highlight={data.content_highligth}
                author={data.authorUser?.name || "Unknown"}
                date={data.createdAt || new Date().toISOString()}
                categoryId={data.categoryId}
                loading={loading}
              />
            ))
          ) : (
            <div className='no-posts'>
              <p>No posts found matching your search criteria.</p>
            </div>
          )}
        </Fade>
      </div>

      {/* Componente de paginación */}
      <Pagination
        postsPerPage={postsPerPage}
        length={filterAndSortPosts().length}
        handlePagination={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Home;