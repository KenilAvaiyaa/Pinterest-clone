const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true
    },
    images:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
