const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(cors()); // Enable CORS

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    user: process.env.DB_USER || 'admin',
    port: process.env.DB_PORT || 5432,
    password: process.env.DB_PASSWORD || 'admin1234',
    database: process.env.DB_NAME || 'survey'
});

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit the application with failure code
    }
    console.log('Connected to database');

    // Create table if not exists
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        mobile VARCHAR(15) NOT NULL UNIQUE,
        nationality VARCHAR(50),
        language VARCHAR(50),
        pin VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    pool.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            process.exit(1); // Exit the application with failure code
        }
        console.log('Table "user" created or already exists');
    });
});

// Route to handle form submissions
app.post('/submit', (req, res) => {
    const { name, age, mobile, nationality, language, pin } = req.body;

    // Basic validation
    if (!name || !age || !mobile || !nationality || !language || !pin) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // SQL query to insert data into the user table
    const insertQuery = `
    INSERT INTO "user" (name, age, mobile, nationality, language, pin)
    VALUES ($1, $2, $3, $4, $5, $6)`;

    pool.query(insertQuery, [name, age, mobile, nationality, language, pin], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Error inserting data.' });
        }
        res.status(200).json({ message: 'User information submitted successfully!' });
    });
});

// Custom error handler middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
