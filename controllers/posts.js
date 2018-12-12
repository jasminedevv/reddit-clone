const Post = require('../models/post');
const User = require('../models/user');
// const Comment = require('../models/comment');

module.exports = (app) => {

    // VIEW CREATE FORM
    app.get('/posts/new', (req, res) => {
        // should eventually pass the sub
        res.render('posts-new');
    });

    app.get('/posts', (req, res) => {
        Post.find(function (err, posts) {
            res.render('posts', { posts: posts });
        })
    });

    // app.get()

    // CREATE

    app.post('/posts', (req, res) => {

        // If not logged in
        if (req.user == null) {
            res.redirect('/login');
        }

        // INSTANTIATE INSTANCE OF POST MODEL
        var post = new Post(req.body);

        User.findById(req.user._id).then((user) => {
            post.author = user
            return post.save()
        }).then(() => {
            res.redirect('/posts/' + post._id)
        }).catch((err) => {
            console.log(err.message);
            res.redirect('/posts')
        })
    })
    /*
    app.post("/posts", (req, res) => {
        var post = new Post(req.body);
        post.author = req.user._id;
 
        post
            .save()
            .then(post => {
                return User.findById(req.user._id);
            })
            .then(user => {
                user.posts.unshift(post);
                user.save();
                // REDIRECT TO THE NEW POST
                res.redirect("/posts/" + post._id);
            })
            .catch(err => {
                console.log(err.message);
            });
    });
    */

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

    app.get("/", (req, res) => {
        var currentUser = req.user;

        Post.find({})
            .then(posts => {
                res.render("posts.handlebars", { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    app.put("/posts/:id/vote-up", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
          post.upVotes.push(req.user._id);
          post.voteScore = post.voteTotal + 1;
          post.save();
      
          res.status(200);
        });
      });
      
      app.put("/posts/:id/vote-down", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
          post.downVotes.push(req.user._id);
          post.voteScore = post.voteTotal - 1;
          post.save();
      
          res.status(200);
        });
      });
}