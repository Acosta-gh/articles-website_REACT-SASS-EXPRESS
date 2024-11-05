import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function MyComponent() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(''); 
  const [contentThumbnail, setContentThumbnail] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState(1); 
  const [categories, setCategories] = useState([]); 
  const [value, setValue] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/category')
      .then((response) => response.json())
      .then((data) => setCategories(data))  
      .catch((error) => console.error("Error fetching categories:", error));
  }, []); 

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmit = async () => {
    console.log("Contenido enviado:", value);
    try {
      const response = await fetch('http://localhost:3000/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          image: image, 
          content_thumbnail: contentThumbnail,
          content_full: value, 
          author: author,
          categoryId: categoryId
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      console.log('Post creado:', data);

      setTitle('');
      setImage('');
      setContentThumbnail('');
      setAuthor('');
      setValue('');
    } catch (error) {
      console.error('Error al enviar el post:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Título del post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Contenido del thumbnail"
        value={contentThumbnail}
        onChange={(e) => setContentThumbnail(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Nombre del autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      
      <select 
        value={categoryId} 
        onChange={(e) => setCategoryId(Number(e.target.value))}
        style={{ marginBottom: '10px', width: '100%' }}
      >
        {categories.length > 0 ? (
          categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>Cargando categorías...</option>
        )}
      </select>

      <ReactQuill
        modules={modules}
        value={value}
        onChange={setValue}
        placeholder="Enter the message..........."
      />
      <button onClick={handleSubmit} style={{ marginTop: '10px' }}>
        Enviar
      </button>

      <style>
        {`
          .ql-editor img {
            max-width: 300px;
            max-height: 200px;
            object-fit: cover;
          }
        `}
      </style>
    </div>
  );
}

export default MyComponent;
