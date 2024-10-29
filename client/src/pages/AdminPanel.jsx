import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function MyComponent() {
  const [value, setValue] = useState('');

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const handleSubmit = () => {
    console.log("Contenido enviado:", value);
  };

  return (
    <div>
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
