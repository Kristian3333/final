const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const Post = require('./models/Post');

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

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
 