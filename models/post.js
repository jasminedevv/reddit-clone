const mongoose = require('mongoose')

const Post = mongoose.model('Post', {
    title: String,
    body: String,
    link: String,
    // movieId: { 
    //     type: String, required: true 
    // }

});

module.exports = Post