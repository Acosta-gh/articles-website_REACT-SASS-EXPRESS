import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { useSearchContext } from "../context/SearchContext";
import LoadingScreen from "../components/LoadingScreen"
import { fetchCategories } from '../services/categoryService';
import { fetchBookmarks } from '../services/bookmarkService';

const POSTS_PER_PAGE = 10;
const API = import.meta.env.VITE_API_URL;

function MyAccount() {
  // Estados
  const { searchTerm } = useSearchContext();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ name: '' });
  const [file, setFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState({ category: false, order: false });
  const [rotation, setRotation] = useState({ category: false, order: false });
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const dropdownRefs = useRef({});
  // Carga inicial
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.replace('/sign');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        window.location.replace('/logout');
        return;
      }
      if (decoded.isAdmin) {
        setIsAdmin(true)
      }
      setisLoggedIn(true)
      //setUserInfo();
      loadCategories();
      loadBookmarks(token);
      fetchUser();
      const cleanup = setupOutsideClick(dropdownRefs, closeAllDropdowns);
      return cleanup;
    } catch (err) {
      console.error("JWT Decode error:", err);
      localStorage.removeItem('token'); // Por las dudas
      window.location.replace('/sign');
    } finally {
      //
    }
  }, []);

  // 📞 Fetch Functions
  const loadCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (err) {
      console.log("Error fetching Categories:", err)
    }
  }

  const loadBookmarks = async (token) => {
    try {
      const data = await fetchBookmarks(token)
      setPosts(data)
    } catch (err) {
      console.log("Error fetching Posts:", err)
    }
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const res = await fetch(`${API}/user/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data)
      setUserInfo(prev => ({ ...prev, email: data.user.email, name: data.user.name, image: data.user.image }));

    } catch (err) {
      console.error("Error fetching User:", err);
    }
  }

  // 👷 Auxiliares
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

  const getCurrentPosts = () => {
    const filtered = getFilteredSortedPosts();
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filtered.slice(start, start + POSTS_PER_PAGE);
  };

  const dropdownItems = {
    category: ['All', ...categories.map(c => c.name)],
    order: ['Newest', 'Oldest'],
  };

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

  // 🖐️ Hanlders
  const toggleDropdown = (type) => {
    const visible = !showDropdown[type];
    setShowDropdown({ category: false, order: false, [type]: visible });
    setRotation({ category: false, order: false, [type]: visible });
  };

  const closeAllDropdowns = () => { // Cerrar dropdowns
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };

  const handleSelect = (type, value) => { // Elegir categoría
    if (type === 'category') setCurrentCategory(value);
    if (type === 'order') setCurrentOrder(value);
    closeAllDropdowns();
  };

  const handleLogout = () => {  // Cerrar Sesión
    window.location.replace('/logout');
  }

  const handleIsEditing = () => {
    setIsEditing(prevState => !prevState)
    console.log(isEditing)
  }

  const handleSubmit = async e => { // Manejar la edición del usuario
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);

    if (file) formDataToSend.append('image', file);
    try {
      const res = await fetch(`${API}/user`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });
      const data = await res.json();
      if(!res.ok){
        const errorMessage = data?.message || 'An error occurred';
        console.error("Error updating user:", errorMessage);
        console.error(data);
        return alert(`${errorMessage}`);
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUserInfo(formDataToSend);
      }
      setFormData({ name: '' });
      fetchUser();
      alert("User updated");
      handleIsEditing();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  if (!isLoggedIn) return <LoadingScreen></LoadingScreen>

  return (
    <Fade triggerOnce duration={500}>
      <div className='myaccount'>
        {/* No me preguntes por qué, ,pero este Fade me jode los z-index del dropdown  <Fade triggerOnce duration={500}>  */}
        <div className="myaccount-profile">

          <div className="profile-avatar">
            <img src={userInfo?.image ? `${API}/uploads/profiles/${userInfo.image}` : ''} ></img>
          </div>

          <span className="line-divider">My Profile</span>
          <div className="myaccount-profile__info">
            <h1 id="username">{userInfo?.name || 'Anonymous'}</h1>
            <p id="bio">{userInfo?.email || 'Loading...'}</p>
          </div>

          <div className='myaccount-profile__actions'>
            <button className='button btn btn-outline' onClick={handleIsEditing}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
            </svg> Edit User</button>
            <button className='button btn btn-danger btn-outline' onClick={() => handleLogout()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
            </svg>Logout</button>
            {isAdmin && <button className='btn btn-secondary btn-outline'><Link to='/adminpanel'>Admin Panel</Link> </button>}
          </div>

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
                  <button className='btn btn-confirm btn-outline' type="submit">Confirm Changes <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                  </svg>
                  </button>
                </form>
              </Fade>
            )}
          </div>
        </div>

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

        <div className='myaccount__posts'>
          <Fade triggerOnce duration={700}>
            {getCurrentPosts().length > 0 ? (
              getCurrentPosts().map(post => (
                console.log(post),
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
        {/* No me preguntes por qué, ,pero este Fade me jode los z-index del dropdown </Fade> */}
      </div>
    </Fade>
  );
};

export default MyAccount;
