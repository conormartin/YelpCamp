var Campground  = require('../models/campground'),
    Comment     = require('../models/comment');

//all middleware functions stored in one object
var middlewareObject = {};

//middleware to check if user id matches campground creater id
middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    //check if user logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                //if logged in, check if user owns campground
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    //if they dont own it, show error and redirect back
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back');
                }    
            }
        })
    } else {
        //if not logged in, show error and redirect back
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }
}

//middleware to check if user id matches campground creater id
middlewareObject.checkCommentOwnership = function(req, res, next) {
    //check if user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                //if logged in, check if user owns comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    //if they dont own it, show error and redirect back
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back');
                }    
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        //if not logged in, show error and redirect back
        res.redirect('back');
    }
};

//middleware function to check if user logged in
middlewareObject.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", 'Cannot do that without being logged in!');
    res.redirect('/login');
};

module.exports = middlewareObject;