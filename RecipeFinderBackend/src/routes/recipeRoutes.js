const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to fetch YouTube video by title
const fetchYouTubeVideo = async (title) => {
    if (!process.env.YOUTUBE_API_KEY) {
        console.error("YouTube API key is missing.");
        return null;
    }
    
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: title,
                key: process.env.YOUTUBE_API_KEY,
                maxResults: 1,
            },
        });

        const video = response.data.items[0];
        return video ? {
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        } : null;
    } catch (error) {
        console.error('Error fetching YouTube video:', error.response?.data || error.message);
        return null; // Return null if fetching video fails
    }
};

// Route to search for recipes using Spoonacular
router.get('/spoonacular/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!process.env.SPOONACULAR_API_KEY) {
        return res.status(500).json({ error: 'Spoonacular API key is missing. Please check your environment configuration.' });
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.SPOONACULAR_API_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        const recipes = response.data.results.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            readyInMinutes: recipe.readyInMinutes,
        }));

        res.json({ recipes });
    } catch (error) {
        console.error('Error fetching recipes from Spoonacular:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
    }
});

// Route to get recipe details by ID from Spoonacular
router.get('/spoonacular/recipes/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    if (!process.env.SPOONACULAR_API_KEY) {
        return res.status(500).json({ error: 'Spoonacular API key is missing. Please check your environment configuration.' });
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`);
        const recipe = response.data;

        // Fetch related YouTube video by recipe title
        const video = await fetchYouTubeVideo(recipe.title);

        res.json({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            ingredients: recipe.extendedIngredients.map(ing => ing.name),
            instructions: recipe.instructions,
            summary: recipe.summary,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            nutrition: recipe.nutrition,
            video: video,
        });
    } catch (error) {
        console.error('Error fetching recipe details from Spoonacular or YouTube:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch recipe details or video' });
    }
});

module.exports = router;
