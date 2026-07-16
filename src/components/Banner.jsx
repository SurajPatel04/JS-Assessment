import React, { useState, useEffect } from 'react';
import requests from '../requests';
import { useToast } from '../context/ToastContext';

function Banner() {
  const [movie, setMovie] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = 'https://api.themoviedb.org/3';
        const request = await fetch(`${baseUrl}${requests.fetchNetflixOriginals}`);
        const data = await request.json();
        setMovie(
          data.results[
            Math.floor(Math.random() * data.results.length)
          ]
        );
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    }
    fetchData();
  }, []);

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }

  const addToHistory = () => {
    if (!movie || Object.keys(movie).length === 0) return;
    const history = JSON.parse(localStorage.getItem('netflix_history') || '[]');
    if (!history.find(m => m.id === movie.id)) {
      localStorage.setItem('netflix_history', JSON.stringify([movie, ...history].slice(0, 20)));
    }
    showToast(`▶ Playing "${movie?.title || movie?.name || movie?.original_name}"`);
  };

  const addToWatchlist = () => {
    if (!movie || Object.keys(movie).length === 0) return;
    const watchlist = JSON.parse(localStorage.getItem('netflix_watchlist') || '[]');
    if (!watchlist.find(m => m.id === movie.id)) {
      localStorage.setItem('netflix_watchlist', JSON.stringify([movie, ...watchlist]));
      showToast(`✓ Added "${movie?.title || movie?.name || movie?.original_name}" to Watchlist`);
    } else {
      showToast(`ℹ "${movie?.title || movie?.name || movie?.original_name}" is already in Watchlist`);
    }
  };

  return (
    <header
      className="banner"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: 'center center',
      }}
    >
      <div className="banner_contents">
        <h1 className="banner_title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner_buttons">
          <button className="banner_button" onClick={addToHistory}>Play</button>
          <button className="banner_button" onClick={addToWatchlist}>My List</button>
        </div>
        <h1 className="banner_description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
