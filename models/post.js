var mongoose = require('mongoose');
Schema = mongoose.Schema;
const Comment = require("./comment");

var PostSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    subreddit: { type: String, required: true },
    comments: [Comment.schema],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    votes: { type: Number, required: true, default: 0}
});

module.exports = mongoose.model('Post', PostSchema);