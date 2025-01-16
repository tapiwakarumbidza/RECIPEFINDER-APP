// src/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config();

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Change if your MySQL username is different
    password: '', // Replace with your actual MySQL password
    database: 'recipefinderdb' // Your database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;
