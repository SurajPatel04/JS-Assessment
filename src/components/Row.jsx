import React, { useState, useEffect, useRef } from 'react';
import requests from '../requests';
import { useToast } from '../context/ToastContext';

const base_url = 'https://image.tmdb.org/t/p/original/';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const observerTarget = useRef(null);
  const rowRef = useRef(null);
  const { showToast } = useToast();
  
  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleMovieClick = (movie) => {
    const history = JSON.parse(localStorage.getItem('netflix_history') || '[]');
    if (!history.find(m => m.id === movie.id)) {
      localStorage.setItem('netflix_history', JSON.stringify([movie, ...history].slice(0, 20)));
    }
    showToast(`▶ Playing "${movie?.title || movie?.name}"`);
  };
  
  useEffect(() => {
    async function fetchData() {
      if (page === 1) setLoading(true);
      setError(false);
      try {
        const baseUrl = 'https://api.themoviedb.org/3';
        const url = fetchUrl.includes('page=') ? fetchUrl.replace(/page=\d+/, `page=${page}`) : `${fetchUrl}&page=${page}`;
        const request = await fetch(`${baseUrl}${url}`);
        if (!request.ok) throw new Error("API failed");
        const data = await request.json();
        
        setMovies(prevMovies => {
          if (page === 1) return data.results;
          const newMovies = data.results.filter(
            (newMovie) => !prevMovies.some((prev) => prev.id === newMovie.id)
          );
          return [...prevMovies, ...newMovies];
        });
      } catch (err) {
        console.error("Error fetching row data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_container">
        <button 
          className="row_arrow row_arrowLeft" 
          onClick={() => handleScroll('left')}
        >
          {'<'}
        </button>
        
        <div className="row_posters" ref={rowRef}>
          {error && <p style={{color: 'red', padding: '20px'}}>Failed to load TV Shows. Please try again.</p>}
          
          {!error && movies.map(
            (movie) =>
              ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
                <img
                  className={`row_poster ${isLargeRow && 'row_posterLarge'}`}
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  loading="lazy"
                  src={`${base_url}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                  style={{cursor: 'pointer'}}
                />
              )
          )}
          
          {loading && [...Array(10)].map((_, i) => (
            <div 
              key={`skeleton-${i}`} 
              className={`skeleton ${isLargeRow ? 'skeleton_posterLarge' : 'skeleton_poster'}`} 
            />
          ))}
          
          {!loading && !error && <div ref={observerTarget} style={{ minWidth: '10px', minHeight: '10px' }} />}
        </div>
        
        <button 
          className="row_arrow row_arrowRight" 
          onClick={() => handleScroll('right')}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}

export default Row;
