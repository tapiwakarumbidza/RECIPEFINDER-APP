const axios = require('axios');
const mysql = require('mysql2');

// Set up database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'recipefinderdb' // Your database name
});

// Spoonacular API credentials
const SPOONACULAR_API_KEY = '16da75cd91ed489484eb34f3e7138e40'; // Replace with your Spoonacular API key
const BASE_URL = 'https://api.spoonacular.com/recipes';

const fetchAndStoreRecipes = async () => {
    try {
        // Fetch random recipes from Spoonacular
        const response = await axios.get(`${BASE_URL}/random?apiKey=${SPOONACULAR_API_KEY}&number=10`);
        const recipes = response.data.recipes;

        // Clear existing recipes (optional)
        await connection.promise().query('DELETE FROM recipes');

        // Prepare the insert statement
        const insertRecipe = 'INSERT INTO recipes (title, ingredients, instructions, cook_time, servings) VALUES (?, ?, ?, ?, ?)';

        for (const recipe of recipes) {
            const ingredients = recipe.extendedIngredients.map(ing => ing.name).join(', '); // Join ingredients as a string
            const instructions = recipe.instructions || 'No instructions available.';
            const cookTime = `${recipe.readyInMinutes} minutes`;
            const servings = recipe.servings;

            // Insert each recipe into the database
            await connection.promise().query(insertRecipe, [recipe.title, ingredients, instructions, cookTime, servings]);
        }

        console.log('Recipes fetched and stored in the database!');
    } catch (error) {
        console.error('Error fetching or storing recipes:', error);
    } finally {
        connection.end(); // Close the database connection
    }
};

// Execute the function
fetchAndStoreRecipes();
