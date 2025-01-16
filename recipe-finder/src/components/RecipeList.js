import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeList.css';

const RecipeList = ({ recipes, videos }) => {
    return (
        <div className="recipe-list">
            {/* Display YouTube videos if no recipes are found */}
            {recipes.length === 0 && videos.length > 0 ? (
                <div className="videos-only">
                    <h3>Check out these related videos:</h3>
                    {videos[0].videos.map((video) => (
                        <div key={video.id.videoId} className="video-item">
                            <h4>{video.snippet.title}</h4>
                            <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                // Display recipes with related YouTube videos
                recipes.map((recipe, index) => (
                    <div key={recipe.id || index} className="recipe-item">
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image || 'https://via.placeholder.com/150'} alt={recipe.title} className="recipe-image" />
                        <p>{recipe.description || 'A delicious recipe to try!'}</p>

                        {/* Video Links for Each Recipe */}
                        <div className="video-links">
                            {videos[index]?.videos.map((video) => (
                                <a
                                    key={video.id.videoId}
                                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="video-link"
                                >
                                    🎥 {video.snippet.title}
                                </a>
                            ))}
                        </div>

                        {/* Link to Recipe Details Page */}
                        <Link to={`/recipe/${recipe.id}`} className="view-recipe-link">
                            View Recipe
                        </Link>
                    </div>
                ))
            )}

            {/* No Results Message */}
            {recipes.length === 0 && videos.length === 0 && (
                <p className="no-results-message">No recipes or videos found. Try a different search!</p>
            )}
        </div>
    );
};

export default RecipeList;
