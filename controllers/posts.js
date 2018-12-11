const Post = require('../models/post');

module.exports = (app) => {

    // VIEW CREATE FORM
    app.get('/posts/new', (req, res) => {
        // should eventually pass the sub
        res.render('posts-new');
    });

    app.get('/', (req, res) => {
        Post.find(function (err, posts) {
            res.render('posts', { posts: posts });
        })
    });

    // app.get()

    // ADD NEW POST
    app.post('/posts', (req, res) => {
        // req.body needs to contain MovieId
        console.log(req.body);
        Post.create(req.body)
            .then((post) => {
                res.redirect(`/posts/${post.id}`);
                console.log(post.id)
            })
            .catch((err) => {
                console.log(err.message)
            })
    });

    // SHOW ONE POST
    app.get('/posts/:id', (req, res) => {
        // LOOK UP THE POST
        Post.findById(req.params.id).populate('comments').then((post) => {
            res.render('post.handlebars', { post })
        }).catch((err) => {
            console.log(err.message)
        })
    });

    // SUBREDDIT

    app.get('/:subreddit', (req, res) => {
        //console.log(req.params.subreddit)

        Post.find({ subreddit: req.params.subreddit }).then((posts) => {
            if (posts == []) {
                res.render('404.handlebars');
            } else {
                res.render('sub', { posts });
            }
        }).catch((err) => {
            console.log(err)
        })
    });
}