import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoriteContext = createContext();

export const useFavorite = () => {
  return useContext(FavoriteContext);
};

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('animal_haus_favorites');
      if (savedFavorites && savedFavorites !== 'undefined' && savedFavorites !== 'null') {
        return JSON.parse(savedFavorites);
      }
      return {};
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      return {};
    }
  });

  // Guardar en localStorage cuando los favoritos cambien
  useEffect(() => {
    localStorage.setItem('animal_haus_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    const savedUser = localStorage.getItem('animal_haus_user');
    if (!savedUser) {
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'login' } }));
      return;
    }

    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
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
