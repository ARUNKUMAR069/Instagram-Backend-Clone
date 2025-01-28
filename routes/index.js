var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer')
const postModel = require('./post')

passport.use(new localStrategy(UserModel.authenticate()));
/* GET home page. */


// Home
router.get('/', function (req, res, next) {
  res.render('index',);
});
// LOGIN
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

// Protected Routes Starting
// Profile
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await UserModel.findOne({ username: req.session.passport.user });
  res.render('profile', { title: 'Express', user });
});
// Feed
router.get('/feed', isLoggedIn,  async function (req, res) {
 const posts= await postModel.find().populate('user')
 const user = await UserModel.findOne({ username: req.session.passport.user });
  res.render('feed',{posts,user})
});
// Update
router.get('/edit', isLoggedIn, async function (req, res) {
  const user = await UserModel.findOne({ username: req.session.passport.user });
  res.render('edit', { user })
});
// Post Upload
router.get('/upload', isLoggedIn, function (req, res) {
  res.render('upload')
});
// Logout
router.get('/logout', isLoggedIn, function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err) };
  })
  res.redirect('/')
})
//  Protected Routes Ending


// POST METHOD ROUTES

router.post('/register', function (req, res) {
  const user = new UserModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
  });
  UserModel.register(user, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile')
      })
    })
});


// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}), function (req, res) {
  res.send('login')
});

// Upload
router.post('/upload', isLoggedIn, upload.single('image'), async function (req, res) {
  const user = await UserModel.findOne({ username: req.session.passport.user });
  if (!req.file) {
    res.send('No file selected')
  }
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile')
});


// Update
router.post("/update", isLoggedIn, async function (req, res) {
  const user = await UserModel.findOneAndUpdate(
    { username: req.session.passport.user },
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true }
  );
  req.login(user, function (err) {
    if (err) throw err;
    res.redirect("/profile");
  });
});

// Creating a post
router.post('/createPost', isLoggedIn, upload.single('image'), async function (req, res) {
  const user = await UserModel.findOne({ username: req.session.passport.user });
  if (!req.file) {
    res.send('No file selected')
  }
  const post = new postModel({
    user: user._id,
    caption: req.body.caption,
    picture: req.file.filename,
  });
  await post.save();
  user.posts.push(post._id);
  await user.save();
  res.redirect('/feed')
});



// Custom Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}


module.exports = router;
