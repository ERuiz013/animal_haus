import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';


const FavoriteContext = createContext();

export const useFavorite = () => {
  return useContext(FavoriteContext);
};

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({});
  const API_URL = API_BASE_URL;

  useEffect(() => {
    const loadFavorites = () => {
      const savedUser = localStorage.getItem('animal_haus_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        fetch(`${API_URL}/getFavorites.php?usuario_id=${user.uuid || user.id || user.id_usuario}`)
          .then(res => res.json())
          .then(data => {
            if (data.favorites) {
              const favObj = {};
              data.favorites.forEach(id => { favObj[id] = true; });
              setFavorites(favObj);
            } else {
              setFavorites({});
            }
          })
          .catch(err => console.error("Error fetching favorites:", err));
      } else {
        setFavorites({});
      }
    };

    loadFavorites();
    window.addEventListener('authChange', loadFavorites);
    return () => window.removeEventListener('authChange', loadFavorites);
  }, [API_URL]);

  const toggleFavorite = (productId) => {
    const savedUser = localStorage.getItem('animal_haus_user');
    if (!savedUser) {
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'login' } }));
      return;
    }
    
    const user = JSON.parse(savedUser);
    const userId = user.uuid || user.id || user.id_usuario;
    const isCurrentlyFavorite = !!favorites[productId];
    const action = isCurrentlyFavorite ? 'remove' : 'add';

    // Optimistic update
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));

    // API Sync
    fetch(`${API_URL}/toggleFavorite.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id: userId,
        articulo_id: productId,
        action: action
      })
    }).catch(err => console.error("Error syncing favorite:", err));
  };

  const getFavoriteCount = () => {
    if (!favorites) return 0;
    return Object.values(favorites).filter(Boolean).length;
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        getFavoriteCount,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
