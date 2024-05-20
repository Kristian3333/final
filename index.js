const path = require('path');
const express = require('express');
const app = express();

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Continue with your existing middleware and routes setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route to render the index view
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' }); // Ensure 'index' matches the name of your EJS file
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;