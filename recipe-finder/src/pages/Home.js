import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaHeart, FaBookOpen } from 'react-icons/fa';
import './Home.css';

const Feature = ({ icon, title, description, onClick }) => {
  return (
    <div 
      className="feature" 
      onClick={onClick} 
      role="button" 
      tabIndex={0} 
      onKeyDown={(e) => e.key === 'Enter' && onClick()} // Enable keyboard navigation
      aria-label={`Navigate to ${title}`}
      aria-labelledby={title} // Improve accessibility
    >
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate(); // Define navigate here

  return (
    <div className="home">
      <h2>Welcome to RecipeFinder!</h2>
      <p>Your go-to app for discovering and sharing delicious recipes.</p>
      <p>Use the navigation to explore recipes, save your favorites, and learn more about us!</p>

      <div className="features">
        <Feature 
          icon={<FaUtensils className="feature-icon" />}
          title="Explore Recipes"
          description="Browse a variety of recipes tailored to your taste and dietary needs."
          onClick={() => navigate('/ExploreRecipes')} // Pass navigate function
        />
        <Feature 
          icon={<FaHeart className="feature-icon" />}
          title="Save Your Favorites"
          description="Bookmark your favorite recipes to easily access them later."
          onClick={() => navigate('/favorites')} // Pass navigate function
        />
        <Feature 
          icon={<FaBookOpen className="feature-icon" />}
          title="Share & Discover"
          description="Share your own recipes and discover new ones from the community."
          onClick={() => navigate('/share')} // Pass navigate function
        />
      </div>

      <div className="cta">
        <h3>Ready to start cooking?</h3>
        <button className="cta-button" onClick={() => navigate('/ExploreRecipes')}>
          Explore Recipes Now!
        </button>
      </div>
    </div>
  );
};

export default Home;
