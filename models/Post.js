const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: String,
    imgName: String,
    text: String,
    avatar: String,
    timestamp: String
});

module.exports = mongoose.model('posts', postSchema);