import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function ProfileScreen({ user, navigate }) {
  const [history, setHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('netflix_history') || '[]'));
    setWatchlist(JSON.parse(localStorage.getItem('netflix_watchlist') || '[]'));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('netflix_history');
    setHistory([]);
  };

  const clearWatchlist = () => {
    localStorage.removeItem('netflix_watchlist');
    setWatchlist([]);
  };

  const handleSignOut = () => {
    signOut(auth);
    navigate('home');
  };

  return (
    <div className="profileScreen">
      <div className="profileScreen_body">
        <h1>Edit Profile</h1>
        <div className="profileScreen_info">
          <img
            src="https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
            alt="Avatar"
          />
          <div className="profileScreen_details">
            <h2>{user.email}</h2>
            <div className="profileScreen_plans">
              <h3>Plans (Current Plan: Premium)</h3>
              
              <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', padding: '20px', opacity: '0.6'}}>
                <div>
                  <h5>Netflix Standard</h5>
                  <h6>1080p</h6>
                </div>
                <button style={{padding: '10px 20px', backgroundColor: '#e50914', color: 'white', border: 'none', cursor: 'pointer'}}>Subscribe</button>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                <div>
                  <h5>Netflix Premium</h5>
                  <h6>4K + HDR</h6>
                </div>
                <button style={{padding: '10px 20px', backgroundColor: 'gray', color: 'white', border: 'none', cursor: 'pointer'}}>Current Package</button>
              </div>

              <button onClick={handleSignOut} className="profileScreen_signOut">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Watchlist</h2>
            {watchlist.length > 0 && <button onClick={clearWatchlist} style={{background: 'transparent', color: 'gray', border: 'none', cursor: 'pointer'}}>Clear</button>}
          </div>
          <div className="row_posters" style={{ padding: '20px 0' }}>
            {watchlist.length > 0 ? watchlist.map((movie) => (
              <img
                key={movie.id}
                className="row_poster"
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`}
                alt={movie.name}
              />
            )) : <p style={{color: 'gray'}}>Your watchlist is empty.</p>}
          </div>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Watch History</h2>
            {history.length > 0 && <button onClick={clearHistory} style={{background: 'transparent', color: 'gray', border: 'none', cursor: 'pointer'}}>Clear</button>}
          </div>
          <div className="row_posters" style={{ padding: '20px 0' }}>
            {history.length > 0 ? history.map((movie) => (
              <img
                key={movie.id}
                className="row_poster"
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`}
                alt={movie.name}
              />
            )) : <p style={{color: 'gray'}}>You haven't watched anything yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
