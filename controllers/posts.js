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
            res.render('posts', posts);
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
            console.log(user);
            return post.save()
        }).then(() => {
            res.redirect('/posts/' + post._id)
        }).catch((err) => {
            console.log(err.message);
            res.redirect('/posts')
        })
    })

    // DELETE
    app.post('/posts/:id', function (req, res) {
        console.log("DELETE post");
        Post.findByIdAndRemove(req.params.id).then((post) => {
            res.redirect('/');
        }).catch((err) => {
            console.log(err.message);
        })
    })

    // SHOW ONE POST
    // app.get('/posts/:id', (req, res) => {
    //     // LOOK UP THE POST
    //     Post.findById(req.params.id).populate('comments').then((post) => {
    //         res.render('post', post);
    //     }).catch((err) => {
    //         console.log(err.message)
    //     })
    // });

    app.get('/posts/:id', (req, res) => {
        // LOOK UP THE POST
        Post.findById(req.params.id)
        .populate('comments')
        .populate('author')
        .then( (post) => {
            post.author = post.author.username;
          res.render('post', {post});
        }).catch((err) => {
          console.log(err.message);
        });
      });

    app.put("/posts/:id/vote-up", function (req, res) {
        Post.findById(req.params.id).exec(function (err, post) {
            // post.upVotes.push(req.user._id);
            post.voteScore = post.votes + 1;
            post.save();

            res.status(200);
        });
    });

    app.put("/posts/:id/vote-down", function (req, res) {
        Post.findById(req.params.id).exec(function (err, post) {
            // post.downVotes.push(req.user._id);
            post.voteScore = post.votes - 1;
            post.save();

            res.status(200);
        });
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
                res.render("posts", { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });
}