import React from 'react';
import './AboutUs.css'; // Create a separate CSS file for AboutUs styles

const AboutUs = () => {
  return (
    <div className="about-us">
      <h2>About RecipeFinder</h2>
      <p>RecipeFinder is designed to help you discover new recipes and share your favorites with friends.</p>
      <p>Our mission is to make cooking fun and accessible for everyone.</p>
      <div className="about-team">
        <h3>Meet the Team</h3>
        <p>We are passionate food lovers and tech enthusiasts dedicated to bringing you the best culinary experiences!</p>
      </div>
    </div>
  );
};

export default AboutUs;
