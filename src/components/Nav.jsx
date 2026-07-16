import React, { useState, useEffect } from 'react';

function Nav({ navigate, currentRoute }) {
  const [show, handleShow] = useState(false);

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavBar);
    return () => window.removeEventListener('scroll', transitionNavBar);
  }, []);

  return (
    <div className={`nav ${show && 'nav_black'}`}>
      <div className="nav_contents">
        <h1 
          className="nav_logo" 
          onClick={() => navigate('home')}
        >
          NETFLIX
        </h1>
        <div className="nav_right">
          <span 
            className="nav_search" 
            onClick={() => navigate('search')}
          >
            🔍
          </span>
          <img
            onClick={() => navigate('profile')}
            className="nav_avatar"
            src="https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
            alt="Avatar"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
