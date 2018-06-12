var express     = require('express');
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('../models/user');

//Homepage
router.get("/", function(req,res) {
    res.render("landing");
})

//==========================
//      AUTH ROUTES
//==========================

//shows register form
router.get('/register', function(req, res) {
    res.render('register')
});

//handles sign up logic, goes to /campgrounds if sign up worked
router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err)
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds');
        });
    });
});

//shows login form
router.get('/login', function(req, res) {
    res.render('login', {message: req.flash('error')});
});

//handles login logic, middleware checks if user logged in before callback runs
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res) {
    //empty
});

//logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
})

//middleware function to check if user logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;