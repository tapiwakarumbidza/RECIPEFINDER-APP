const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const recipeRoutes = require('./routes/recipeRoutes'); // Import the recipe routes

// Load environment variables
dotenv.config();

// Create the express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// Use middleware
app.use(cors(corsOptions));
app.use(bodyParser.json()); // Parsing JSON requests

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recipefinderdb'
});

// Check connection
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Basic route
app.get('/', (req, res) => {
    res.send('RecipeFinder API is running');
});

// Use the recipeRoutes for requests to /api/recipes
app.use('/api/recipes', recipeRoutes);

// Route to handle signup
app.post('/signup', async (req, res) => {
    const { name, surname, email, password } = req.body;

    // Simple validation
    const nameRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!nameRegex.test(name) || !nameRegex.test(surname)) {
        return res.status(400).json({ message: 'Name and surname cannot contain numbers' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least 8 characters, including a letter, number, and special character' });
    }

    // Hash password before storing
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
        db.query(query, [name, surname, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while hashing password' });
    }
});

// Route to handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare the entered password with the hashed password in the database
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).json({ message: 'Login successful', user });
            } else {
                res.status(400).json({ message: 'Incorrect password' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error while comparing passwords' });
        }
    });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
