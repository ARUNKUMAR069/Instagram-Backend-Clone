var express = require('express');
var router = express.Router();

/* GET home page. */

// LOGIN
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});


router.get('/', function (req, res, next) {
  res.render('index',);
});




router.post('/signup', function (req, res, next) {




})





module.exports = router;
