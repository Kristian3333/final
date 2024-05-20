const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require('dotenv').config({ path: '.env.local' });


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

const PostSchema = new mongoose.Schema({
    title: String,
    name: String,
    comment: String,
    date: { type: Date, default: Date.now }
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
module.exports = Post;

// Route to display the form and list posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find();  // Fetch all posts from MongoDB
        let html = `
        <html>
        <head>
            <title>Posts</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { display: flex; flex-wrap: wrap; justify-content: space-around; padding: 20px; }
                .post { margin: 10px; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 30%; min-width: 300px; background-color: #f9f9f9; }
                form { margin-top: 20px; padding: 20px; background-color: #f0f0f0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                input, textarea, button { width: 100%; margin-top: 8px; padding: 8px; box-sizing: border-box; }
                button { background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background-color: #45a049; }
            </style>
        </head>
        <body>
            <h1>Posts</h1>
            <div class="container">`;

        posts.forEach(post => {
            html += `
                <div class="post">
                    <h2>${post.title}</h2>
                    <p>Posted by: ${post.name}</p>
                    <p>${post.comment}</p>
                    <p>Date: ${post.date.toISOString().split('T')[0]}</p>
                </div>`;
        });

        html += `</div>
            <h2>Add a New Post</h2>
            <form action="/" method="post">
                <input type="text" name="title" placeholder="Title" required>
                <input type="text" name="name" placeholder="Your Name" required>
                <textarea name="comment" placeholder="Your Comment" required></textarea>
                <button type="submit">Post</button>
            </form>
        </body>
        </html>`;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).send("Failed to retrieve posts from the database");
    }
});


app.post('/', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.redirect('/');  // Redirect back to the homepage which now includes the new post
    } catch (error) {
        console.error("Failed to create post", error);
        res.status(500).send("Failed to create post");
    }
});

  