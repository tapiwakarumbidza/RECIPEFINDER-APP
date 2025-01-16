import React, { useState } from 'react';
import './Share.css'; // Import the CSS file

const Share = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (recipeName && ingredients && instructions) {
      setMessage(`Recipe "${recipeName}" submitted successfully!`);
      setRecipeName('');
      setIngredients('');
      setInstructions('');
    } else {
      setMessage('Please fill out all fields.');
    }
  };

  return (
    <div className="share">
      <h2>Share Your Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="recipeName">Recipe Name:</label>
          <input
            type="text"
            id="recipeName"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients:</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            placeholder="List your ingredients here..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="instructions">Instructions:</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            placeholder="Describe the steps to prepare the recipe..."
          />
        </div>
        <button type="submit" className="submit-button">Submit Recipe</button>
      </form>
      {message && <p className="submission-message">{message}</p>}
    </div>
  );
};

export default Share;
