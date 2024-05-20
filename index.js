const express = require('express');
const app = express();

// Configure your middleware, routes, etc., as usual
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app instance for Vercel to use
module.exports = app;