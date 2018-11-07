const Post = require('../models/post');

module.exports = (app) => {

    // VIEW CREATE FORM
    app.get('/r/sub/posts/new', (req, res) => {
        // should eventually pass the sub
        res.render('posts-new');
    })

    app.get('/r/sub/posts', (req, res) => {
        Post.find(function (err, posts) {
            res.render('posts', { posts: posts });
        })
    })

    app.get()

    // ADD NEW POST
    app.post('/r/sub/posts', (req, res) => {
        // req.body needs to contain MovieId
        console.log(req.body);
        Post.create(req.body)
            .then((post) => {
                res.redirect(`/r/sub/posts/${post.id}`);
                console.log(post.id)
            })
            .catch((err) => {
                console.log(err.message)
            })
    });
}