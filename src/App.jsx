import { useState, useEffect } from 'react';
import './App.css';

import Home from './components/Home.jsx';
import Login from './components/Login.jsx';

import user from './scripts/user.js';
import { API_URL } from './constants/api.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const result = await user.isAuthenticated(API_URL);
        setIsAuthenticated(result);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthentication();
  }, []);

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  return (
      <section id="center">
        {isAuthenticated ? (
            <Home />
        ) : (
            <Login onLogin={() => setIsAuthenticated(true)} />
        )}
      </section>
  );
}

export default App;