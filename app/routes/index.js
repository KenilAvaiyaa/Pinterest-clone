var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./post');
const passport = require('passport');

const localstrategy = require('passport-local')
passport.use(new localstrategy(userModel.authenticate()))

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error: req.flash("error")});
});

router.get('/feed', function(req, res, next) {
  res.render('feed' );
});

router.get('/profile', isLoggedIn,function(req, res, next) {
  res.render('profile');
});

router.post('/ragister',(req,res)=>{
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

userModel.register(userData, req.body.password)
.then(()=>{
  passport.authenticate("local")(req,res,function (){
    res.redirect('/profile')
  })
})
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}),(req,res)=>{})

router.get('/logout',(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect ('/login')
}
module.exports = router;
