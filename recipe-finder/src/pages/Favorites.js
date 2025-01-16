import React, { useState, useEffect } from 'react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = () => {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(savedFavorites);
    };

    fetchFavorites();
  }, []);

  const removeFavorite = (recipeId) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      {favorites.length > 0 ? (
        <div className="recipe-list">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="recipe-item">
              <h4>{recipe.label}</h4>
              <img src={recipe.image} alt={recipe.label} />
              <button onClick={() => removeFavorite(recipe.id)}>Remove from Favorites</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorites yet. Start exploring recipes and add them to your favorites!</p>
      )}
    </div>
  );
};

export default Favorites;
