var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
var multer = require('multer');
var FacebookStrategy = require('passport-facebook').Strategy
var fbConfig =  require('./config/fb')
var mongoose = require('mongoose');
require('./models/posts');
require('./models/user')
var User = mongoose.model('User');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.use(passport.initialize());
app.use(passport.session());


//todo : Shif the startegy to some other foler

passport.serializeUser(function(user, done) {
        done(null, user.id);
});

    // used to deserialize the user
passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
      });
});
    

passport.use(new FacebookStrategy({
    clientID: fbConfig.appID,
    clientSecret: fbConfig.appSecret,
    callbackURL: fbConfig.callbackUrl,
    profileFields: ['id', 'first_name', 'last_name', 'photos', 'emails']
  },


  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      
      User.findOne({ 'id' : profile.id }, function(err, user) {
 
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); 
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            
            //console.log(profile);
            // set all of the facebook information in our user model
            newUser.id    = profile.id;                 
            newUser.access_token = accessToken;                 
            newUser.name  = profile.givenName;
            newUser.profilePicture = profile.photos[0].value; 
            newUser.email = profile.emails[0].value; 
 
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;

              return done(null, newUser);
            });
         } 
      });
    });
  }
));






mongoose.connect('mongodb://127.0.0.1/test');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//For storing the uploaded images 
//app.use('/uploads', express.static(__dirname + '/uploads'));
//app.use(multer({dest: './uploads/'}))


app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//app.use(multer({dest:'./uploads/'}));


module.exports = app;
