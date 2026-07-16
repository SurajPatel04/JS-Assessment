import React, { useState, useEffect } from 'react';
import './index.css';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import ProfileScreen from './pages/ProfileScreen';
import SearchScreen from './pages/SearchScreen';
import Nav from './components/Nav';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('home');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser({
          uid: userAuth.uid,
          email: userAuth.email,
        });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigate = (route) => {
    setCurrentRoute(route);
  };

  return (
    <div className="app">
      {isOffline && (
        <div className="offline-banner">
          You are currently offline. Some features may not be available.
        </div>
      )}
      
      {isAuthLoading ? (
        <div className="auth-loading">
          <h1 className="nav_logo">NETFLIX</h1>
        </div>
      ) : !user ? (
        <LoginScreen />
      ) : (
        <>
          <Nav navigate={navigate} currentRoute={currentRoute} />
          <div className="screen-transition fade-in">
            {currentRoute === 'home' && <HomeScreen />}
            {currentRoute === 'profile' && <ProfileScreen user={user} navigate={navigate} />}
            {currentRoute === 'search' && <SearchScreen />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
