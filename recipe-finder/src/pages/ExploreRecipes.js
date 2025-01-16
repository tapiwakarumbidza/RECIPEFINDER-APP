import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import RecipeList from '../components/RecipeList';
import './ExploreRecipes.css';
import { useLocation } from 'react-router-dom';

const ExploreRecipes = () => {
    const location = useLocation();
    const { query: initialQuery } = location.state || { query: '' };
    const [query, setQuery] = useState(initialQuery || 'food');
    const [recipes, setRecipes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState([]); // State to track favorites

    // Load favorites from localStorage on component mount
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    // Fetch YouTube videos related to a recipe
    const fetchYouTubeVideos = useCallback(async (recipeTitle) => {
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        const apiUrl = `https://www.googleapis.com/youtube/v3/search`;
        try {
            const response = await axios.get(apiUrl, {
                params: {
                    part: 'snippet',
                    q: recipeTitle,
                    key: YOUTUBE_API_KEY,
                    type: 'video',
                    maxResults: 3,
                },
            });
            return response.data.items;
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }, []);

    // Search for recipes and fetch videos
    const handleSearch = useCallback(async () => {
        if (!query) {
            setError('Please enter a search term.');
            return;
        }
        setError('');
        try {
            const apiUrl = `http://localhost:5000/api/recipes/spoonacular/search`;
            const response = await axios.get(apiUrl, { params: { q: query } });
            const fetchedRecipes = response.data.recipes || [];
            setRecipes(fetchedRecipes);

            const allVideos = await Promise.all(
                fetchedRecipes.map(async (recipe) => {
                    if (recipe.title) {
                        const videos = await fetchYouTubeVideos(recipe.title);
                        return { recipe, videos };
                    }
                    return { recipe, videos: [] };
                })
            );
            setVideos(allVideos);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError(`Failed to fetch recipes. ${err.response?.data?.error || ''}`);
        }
    }, [query, fetchYouTubeVideos]);

    // Handle query input changes
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    // Add a recipe to favorites
    const addToFavorites = (recipe) => {
        const updatedFavorites = [...favorites, recipe];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Remove a recipe from favorites
    const removeFromFavorites = (recipeId) => {
        const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Check if a recipe is already in favorites
    const isFavorite = (recipeId) => {
        return favorites.some(recipe => recipe.id === recipeId);
    };

    useEffect(() => {
        handleSearch(); // Call search on component mount or when query changes
    }, [handleSearch, query]);

    return (
        <div className="explore-recipes">
            <h1>Explore Recipes</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search for recipes..."
                />
                <button type="submit">Search</button>
            </form>
            {error && <p className="error-message">{error}</p>}

            {/* Displaying search results */}
            <div className="recipe-list">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-item">
                            <h4>{recipe.title}</h4>
                            <img src={recipe.image} alt={recipe.title} />
                            {!isFavorite(recipe.id) ? (
                                <button onClick={() => addToFavorites(recipe)}>
                                    Add to Favorites
                                </button>
                            ) : (
                                <button onClick={() => removeFromFavorites(recipe.id)}>
                                    Remove from Favorites
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No recipes found. Try another search.</p>
                )}
            </div>

            {/* View Favorites Section */}
            <div className="view-favorites">
                <h2>View Favorites</h2>
                {favorites.length > 0 ? (
                    <div className="favorites-list">
                        {favorites.map((recipe) => (
                            <div key={recipe.id} className="favorite-item">
                                <h4>{recipe.title}</h4>
                                <img src={recipe.image} alt={recipe.title} />
                                <button onClick={() => removeFromFavorites(recipe.id)}>
                                    Remove from Favorites
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No favorites yet.</p>
                )}
            </div>

            <RecipeList recipes={recipes} videos={videos} />
        </div>
    );
};

export default ExploreRecipes;
