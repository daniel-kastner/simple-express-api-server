const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
require('dotenv').config();
const PORT = process.env.API_PORT

// create new APP Object
const app = express();
app.use(bodyParser.json());

//create array for possible posts
const posts = [];

//display all exisisting posts on http://server:port/posts
app.get("/posts", (req, res) => {
    res.json(posts)
})

//display post with id on http://server:port/posts/123456
app.get("/posts/:id", (req, res) => {
    const post = posts.find((post) => post.id == req.params.id)
    if(!post) return res.status(404)
    res.json(post)
})

//create new post and generate random, unique ID for it.
app.post("/posts", (req, res) => {
    const body = req.body;
    if(!body.name || !body.author || !body.content) {
        return res.sendStatus(400)
    }
    const post = {
        id: createPostID(),
        createdAt: new Date(),
        name: body.name,
        author: body.author,
        content: body.content
    }
    posts.push(post);
    res.json(post)
})

//Delete post with given ID
app.delete("/posts/:id", (req, res) => {
    const post = posts.find((post) => post.id == req.params.id)
    if(!post) return res.status(404)
    posts.splice(posts.indexOf(post), 1)
    res.json(post)
})

//start listening server
app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
})


//generate IDs untill the ID isnt unique. Return unique ID
function createPostID() {
    const id = randomBytes(8).toString("hex");
    if(posts.some((post) => post.id === id)) return createPostID();
    return id;
}