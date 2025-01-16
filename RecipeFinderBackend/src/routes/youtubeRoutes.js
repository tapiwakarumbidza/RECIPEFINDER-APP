// src/routes/youtubeRoutes.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Route: Search YouTube videos by keyword
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the search query from URL

    // Validate the query parameter
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({ error: 'A valid query parameter is required' });
    }

    // Check if the API key is present
    if (!process.env.YOUTUBE_API_KEY) {
        return res.status(500).json({ error: 'YouTube API key is missing. Please check your environment configuration.' });
    }

    try {
        // Call YouTube Data API
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                key: process.env.YOUTUBE_API_KEY,
                maxResults: 10,
                type: 'video'
            }
        });

        // Map through the items to extract relevant data
        const videos = response.data.items.map(item => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url, // Higher resolution thumbnail
            videoId: item.id.videoId,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channelTitle: item.snippet.channelTitle
        }));

        res.json({ videos }); // Send cleaned-up data back to the client
    } catch (error) {
        console.error('Error fetching YouTube videos:', error.message);
        if (error.response) {
            console.error('Error details:', error.response.data);
            res.status(error.response.status).json({
                error: 'Failed to fetch YouTube videos',
                details: error.response.data.error.message || error.message
            });
        } else {
            res.status(500).json({ error: 'Failed to fetch YouTube videos', details: error.message });
        }
    }
});

module.exports = router;
