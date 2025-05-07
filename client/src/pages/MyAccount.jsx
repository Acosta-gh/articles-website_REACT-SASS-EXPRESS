import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Fade } from "react-awesome-reveal";

import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { useSearchContext } from "../context/SearchContext";
import LoadingScreen from "../components/LoadingScreen"

const POSTS_PER_PAGE = 10;
const API = "http://127.0.0.1:3000";

function MyAccount() {
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const fileInputRef = useRef(null);
  const dropdownRefs = useRef({});

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
        window.location.replace('/adminpanel');
        return;
      }

      setUserInfo(decoded);
      fetchCategories();
      fetchPosts();
      fetchProfilePicture();
     
    } catch (err) {
      console.error("JWT Decode error:", err);
      window.location.href = '/sign';
    } finally{
      
    }
  }, []);

  const fetchProfilePicture = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const res = await fetch(`${API}/user/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserInfo(prev => ({ ...prev, profilePicture: data.user.image }));
      console.log("Foto de perfil cargada:", data.profilePicture);


    } catch (err) {
      console.error("Error fetching ProfilePicture:", err);
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/category/`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API}/bookmark`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleSubmit = async e => {
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
      if (!res.ok) return alert(`Error: ${data.message}`);

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUserInfo(jwtDecode(data.token));
      }

      setFormData({ name: '' });
      fetchProfilePicture();
      alert("Nombre editado");
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

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

  const toggleDropdown = (type) => {
    const visible = !showDropdown[type];
    setShowDropdown({ category: false, order: false, [type]: visible });
    setRotation({ category: false, order: false, [type]: visible });
  };

  const closeAllDropdowns = () => {
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };

  const handleSelect = (type, value) => {
    if (type === 'category') setCurrentCategory(value);
    if (type === 'order') setCurrentOrder(value);
    closeAllDropdowns();
  };

  const handleLogout = () =>{
    window.location.replace('/logout');
  }

  const dropdownItems = {
    category: ['All', ...categories.map(c => c.name)],
    order: ['Newest', 'Oldest'],
  };

  return (
    <div className='home'>
      <h5>My Bookmarks</h5>
      <p>{userInfo?.email || 'Loading...'}</p>
      <p>{userInfo?.name || 'Loading...'}</p>
      <img src={userInfo?.profilePicture ? `${API}/uploads/${userInfo.profilePicture}` : ''} />
      <button onClick={() => handleLogout()}>Logout</button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>New Name:</label>
          <input type="text" name="name" value={formData.name} onChange={e => setFormData({ name: e.target.value })} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files[0])} accept="image/*" />
        </div>
        <button className='button' type="submit">Update User</button>
      </form>

      <div className='home__filters'>
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

      <div className='home__posts'>
        <Fade triggerOnce duration={700}>
          {getCurrentPosts().length > 0 ? (
            getCurrentPosts().map(post => (
              <Post
                key={post.id}
                index={post.id}
                image={post.image ? `${API}/uploads/${post.image}` : null}
                title={post.title}
                content={post.content}
                content_highlight={post.content_highligth}
                author={post.authorUser?.name || "Unknown"}
                date={post.createdAt}
                categoryId={post.categoryId}
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
        postsPerPage={POSTS_PER_PAGE}
        length={getFilteredSortedPosts().length}
        handlePagination={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default MyAccount;
