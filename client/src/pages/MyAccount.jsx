import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Post from "../components/Post";

function Profile() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/logout');

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        alert('Token expired');
        localStorage.removeItem('token');
        return navigate('/logout');
      }

      setUser(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      navigate('/logout');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3000/bookmark/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        return response.json();
      })
      .then(data => setBookmarks(data))
      .catch(error => console.error("Error fetching bookmarks:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/logout');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='myaccount'>
      <h1>User</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {user.isAdmin && (
        <button onClick={() => navigate('/adminpanel')} className='button'>Go to admin panel</button>
      )}

      <h2>Bookmarks</h2>

      <div className='myaccount__posts'>
        {loading ? (
          <p>Loading bookmarks...</p>
        ) : bookmarks.length > 0 ? (
          bookmarks.map(data => {
            const imageUrl = data.image ? `http://localhost:3000/uploads/${data.image}` : null;
            return (
              <div
                key={data.id}
                onClick={() => navigate(`/article/${data.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Post
                  index={data.id}
                  image={imageUrl}
                  title={data.title}
                  content={data.content}
                  content_highlight={data.content_highligth}
                  author={data.authorUser?.name || "Unknown"}
                  date={data.createdAt || new Date().toISOString()}
                  categoryId={data.categoryId}
                  loading={false}
                />
              </div>
            );
          })
        ) : (
          <div className='myaccount__no-posts'>
            <p>No bookmarks found.</p>
          </div>
        )}
      </div>

      <button onClick={handleLogout} className='button'>Log out</button>
    </div>
  );
}

export default Profile;
