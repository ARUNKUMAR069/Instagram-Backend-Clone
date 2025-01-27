const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    picture: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date:
    {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]


});

module.exports = new mongoose.model('Post', postSchema);