// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import ExploreRecipes from './pages/ExploreRecipes';
import Favorites from './pages/Favorites';
import Share from './pages/Share';
import Navbar from './components/Navbar';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import RecipeDetails from './pages/RecipeDetails';
import Signup from './pages/Signup';  // Add Signup
import Login from './pages/Login';    // Add Login

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ExploreRecipes" element={<ExploreRecipes />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/share" element={<Share />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/signup" element={<Signup />} /> {/* Signup route */}
                <Route path="/login" element={<Login />} />   {/* Login route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
