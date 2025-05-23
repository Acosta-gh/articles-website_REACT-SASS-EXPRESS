import React from 'react';

const Contact = () => {
  return (
    <section className="contact page-container">
      <div className="contact__content">
        <h1 className='title'>Contact Us</h1>
        <p className='paragraph'>
          Have a question, suggestion, or just want to say hello? We'd love to hear from you!  
          Feel free to reach out via email or follow us on social media.
        </p>
        <div className="contact__info">
          <p className='paragraph'><strong>Email:</strong> contact@ourblog.com</p>
          <p className='paragraph'><strong>Instagram:</strong> @ourblog</p>
          <p className='paragraph'><strong>Facebook:</strong> facebook.com/ourblog</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
