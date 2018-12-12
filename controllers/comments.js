var Post = require('../models/post');
var Comment = require('../models/comment');
var User = require('../models/user');

module.exports = (app) => {
    // CREATE BASIC BITCH COMMENT
    // TODO
    app.post("/posts/:postId/comments", (req, res) => {
        var comment = new Comment(req.body);
        
        User.findById(req.user._id).then((user) => {
            comment.author = user
            console.log(user);
        }).then(() => {
            Post.findById(req.params.postId).exec(function (err, post) {
                // UNSHIFT A NEW COMMENT
                post.comments.unshift(comment);
                // SAVE THE PARENT
                post.save();

                // REDIRECT BACK TO THE PARENT POST#SHOW PAGE TO SEE OUR NEW COMMENT IS CREATE
                return res.redirect(`/posts/` + post._id);
            });
        }).catch( (err)=> {
            console.log(err.message)
        })
        // FIND THE PARENT POST

    });

    // CREATE SPECIAL NESTED COMMENT
    app.post('/comments/:commentid', (req, res) => {
        // INSTANTIATE INSTANCE OF MODEL
        var comment = new Comment(req.body);
        console.log(req.body)
        // SAVE INSTANCE OF POST MODEL TO DB
        // NOTE: throws integrity errors if the post was made before schema changes

        Comment.findById(req.params.commentid).then((og_comment) => {
            // findById resolved
            console.log(og_comment)
            og_comment.comments.unshift(comment)
            return og_comment.save()
        }).then((og_comment) => {
            // post.save resolved
            return comment.save()
        }).then((og_comment) => {
            // comment.save resolved
            res.redirect('/')
        }).catch((err) => {
            console.log(err.message, "Could not save comment!")
            res.redirect('/')
        })
    })

}