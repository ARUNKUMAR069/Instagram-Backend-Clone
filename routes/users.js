const { name } = require('ejs');
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Instagram');


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
})
userSchema.plugin(plm);
module.exports = new mongoose.model('User', userSchema);
