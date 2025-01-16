import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=16da75cd91ed489484eb34f3e7138e40`);
        
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to fetch recipe details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto p-6 text-center">Loading recipe details...</div>;
  if (error) return <div className="max-w-3xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>;
  if (!recipe) return <div className="max-w-3xl mx-auto mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">No recipe found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-gray-800">{recipe.title || 'Recipe Title'}</h1>
            <div className="flex gap-4 text-gray-600">
              {recipe.readyInMinutes && (
                <div className="flex items-center gap-1 text-sm">
                  <span role="img" aria-label="time" className="text-xl">⏲️</span>
                  <span>{recipe.readyInMinutes} minutes</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-1 text-sm">
                  <span role="img" aria-label="servings" className="text-xl">👥</span>
                  <span>{recipe.servings} servings</span>
                </div>
              )}
            </div>
          </div>

          {recipe.diets && recipe.diets.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {recipe.diets.map((diet, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-sm text-blue-800 rounded-full">
                  {diet}
                </span>
              ))}
            </div>
          )}

          {recipe.image && (
            <div className="relative h-80 overflow-hidden rounded-lg mt-4 mb-6">
              <img src={recipe.image} alt={recipe.title} className="object-cover w-full h-full rounded-lg" />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Ingredients</h3>
              <div className="max-h-64 overflow-y-auto pr-4 bg-gray-50 p-4 rounded-lg shadow-md">
                {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                  <ul className="space-y-2 text-gray-700">
                    {recipe.extendedIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="text-green-600">✔️</span> {ingredient.original}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No ingredients available.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Instructions</h3>
              <div className="max-h-80 overflow-y-auto pr-4 bg-gray-50 p-4 rounded-lg shadow-md">
                {recipe.instructions ? (
                  <div
                    className="instructions space-y-2 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                ) : (
                  <p className="text-gray-500">No instructions available.</p>
                )}
              </div>
            </div>
          </div>

          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-500 hover:underline mt-6"
            >
              <span role="img" aria-label="video" className="text-xl">🎥</span>
              View Full Recipe
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
