var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Share' });
});

//GET all of the posts 
router.get('/posts', function(req,res,next){

	
	Post.find(function(err, posts){
		if (err) {
			next(err);
		}

		res.render('allPosts', { 
			title: 'Image Share',
			posts : posts
		 });
		
	})
});

//POST Adding the posts/images to the databse
router.post('/post', function(req,res,next){
	console.log(req.body.title);

	var imagePost = new Post({
		title: req.body.title,
		link : req.body.link
	});
	imagePost.save(function(err, result){
		if(err){
			return next(err);
		}

		res.json(imagePost);
	});
});

//GET image with its id
router.get('/post/:id', function(req,res,next){
	Post.find(req.params.id, function(err,result){
		if (err) {
			next(err);
		}
		if(!result)
			next(new Error('Can\'t find image'));
		res.json(result);
	});
});


router.get('/home',isLoggedIn, function(req, res, next){
	res.render('profile.ejs', {
		user : req.user
	});
});

router.get('/login/facebook', 
  passport.authenticate('facebook', { scope : ['email' ]}
));
 
// handling the callback after facebook has authenticated the user
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/home',
    failureRedirect : '/'
  })
);

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
    return next();
    //res.redirect('/');
}

module.exports = router;
