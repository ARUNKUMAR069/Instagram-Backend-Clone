var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');

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
router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('profile', { title: 'Express' });
});
// Feed
router.get('/feed', isLoggedIn, function (req, res) {
  res.render('feed')
});
// Update
router.get('/edit', function (req, res) {
  res.render('edit')
});
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


// Logout
router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err) };
  })
  res.redirect('/')

})


// Upload
router.post('/upload', upload.single('file'), async function (req, res) {
  
  if (!req.file) {
    return res.status(400).send('Please upload a file')
  }
  const user=await UserModel.findOneAndUpdate({username:req.session.passport.user});
  res.send('File uploaded successfully')

});


// Custom Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}


module.exports = router;
