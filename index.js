const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const Post = require('./models/Post');

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function connectToDatabase(uri) {
    if (cachedDb) {
        return Promise.resolve(cachedDb);
    }
    return mongoose.connect(uri).then((db) => {
        cachedDb = db;
        return db;
    });
}

connectToDatabase(process.env.MONGODB_URI);
 

// Route to display the form and list posts
app.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.render('posts', { posts });
    } catch (error) {
        next(error);
    }
});

app.post('/', async (req, res, next) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;

 