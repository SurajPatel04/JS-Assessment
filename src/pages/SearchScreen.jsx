import React, { useState, useEffect } from 'react';
import requests from '../requests';
import { useToast } from '../context/ToastContext';

const base_url = 'https://image.tmdb.org/t/p/original/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { showToast } = useToast();
  
  // Initial load: Fetch some popular movies to display before searching
  useEffect(() => {
    async function fetchInitial() {
      try {
        const baseUrl = 'https://api.themoviedb.org/3';
        const request = await fetch(`${baseUrl}${requests.fetchTrending}`);
        const data = await request.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Failed to fetch initial movies:", err);
      } finally {
        setIsReady(true);
      }
    }
    fetchInitial();
  }, []);

  // Search logic: Debounced API calls to TMDB /search/multi
  useEffect(() => {
    if (!searchTerm) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const baseUrl = 'https://api.themoviedb.org/3';
        const response = await fetch(`${baseUrl}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        // filter out people/actors, only keep movies/tv shows
        const filtered = (data.results || []).filter(item => item.media_type !== 'person');
        setResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce to prevent API spam

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMovieClick = (movie) => {
    const history = JSON.parse(localStorage.getItem('netflix_history') || '[]');
    if (!history.find(m => m.id === movie.id)) {
      localStorage.setItem('netflix_history', JSON.stringify([movie, ...history].slice(0, 20)));
    }
    showToast(`▶ Playing "${movie?.title || movie?.name}"`);
  };

  return (
    <div className="searchScreen">
      {isReady && (
        <input 
          type="text"
          className="searchScreen_input fade-in"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearch}
        />
      )}
      
      <div className="search_results">
        {(!isReady || isSearching) && [...Array(12)].map((_, i) => (
          <div key={`search-skeleton-${i}`} style={{display: 'flex', flexDirection: 'column'}}>
            <div className="skeleton" style={{width: '100%', height: '150px', marginBottom: '10px'}} />
            <div className="skeleton" style={{width: '60%', height: '20px'}} />
          </div>
        ))}
        
        {isReady && !isSearching && results.map(movie => (
          (movie.backdrop_path || movie.poster_path) && (
            <div key={movie.id} className="search_result fade-in" onClick={() => handleMovieClick(movie)}>
              <img 
                src={`${base_url}${movie.backdrop_path || movie.poster_path}`} 
                alt={movie.name || movie.title}
                loading="lazy"
              />
              <p style={{marginTop: '10px'}}>{movie.name || movie.title} ({movie.first_air_date?.substring(0,4) || movie.release_date?.substring(0,4)})</p>
            </div>
          )
        ))}
      </div>
      
      {isReady && !isSearching && searchTerm && results.length === 0 && (
        <h2 style={{color: 'gray', textAlign: 'center', marginTop: '50px'}}>No results found</h2>
      )}
    </div>
  );
}

export default SearchScreen;
