var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./post');
const passport = require('passport');
const uplode = require('./multer')

const localstrategy = require('passport-local');
const { default: mongoose } = require('mongoose');
passport.use(new localstrategy(userModel.authenticate()))

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error: req.flash("error")});
});

router.post('/uplode',isLoggedIn, uplode.single('file') ,async function(req, res, next) {
  if(!req.file){
    return res.status(400).send('No file is uplode')
  }
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  const post = await postModel.create({
    postText: req.body.imageinfo,
    images: req.file.filename,
    user:user._id,
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
});

router.get('/feed', function(req, res, next) {
  res.render('feed' );
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  .populate('posts')
  res.render('profile',{user});
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
