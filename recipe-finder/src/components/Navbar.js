import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaHeart, FaListAlt, FaInfoCircle, FaShareAlt, FaUser, FaUserPlus } from 'react-icons/fa'; 
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>RecipeFinder</h1>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink exact to="/" activeClassName="active">
                        <FaHome className="icon" /> Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/ExploreRecipes" activeClassName="active">
                        <FaListAlt className="icon" /> Explore Recipes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/favorites" activeClassName="active">
                        <FaHeart className="icon" /> Favorites
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/share" activeClassName="active">
                        <FaShareAlt className="icon" /> Share a Recipe
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about-us" activeClassName="active">
                        <FaInfoCircle className="icon" /> About Us
                    </NavLink>
                </li>
                {/* Adding Login and Signup links with icons */}
                <li>
                    <NavLink to="/login" activeClassName="active" className="login-signup-link">
                        <FaUser className="icon" /> Login
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/signup" activeClassName="active" className="login-signup-link">
                        <FaUserPlus className="icon" /> Signup
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
