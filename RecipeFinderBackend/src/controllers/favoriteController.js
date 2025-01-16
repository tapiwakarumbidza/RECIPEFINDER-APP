// src/controllers/favoriteController.js
const db = require('../db'); // Import your database connection

// Add a favorite recipe
exports.addFavorite = async (req, res) => {
    const { userId, videoId, title, thumbnail, channelTitle } = req.body;

    if (!userId || !videoId) {
        return res.status(400).json({ error: 'User ID and video ID are required' });
    }

    try {
        const result = await db.query('INSERT INTO favorites (user_id, video_id, title, thumbnail, channel_title) VALUES (?, ?, ?, ?, ?)', 
        [userId, videoId, title, thumbnail, channelTitle]);
        res.status(201).json({ id: result.insertId, userId, videoId, title, thumbnail, channelTitle });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite recipe' });
    }
};

// Retrieve all favorite recipes for a user
exports.getFavorites = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const favorites = await db.query('SELECT * FROM favorites WHERE user_id = ?', [userId]);
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorite recipes' });
    }
};

// Delete a favorite recipe
exports.deleteFavorite = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM favorites WHERE id = ?', [id]);
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ error: 'Failed to delete favorite recipe' });
    }
};
