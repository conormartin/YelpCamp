var express     = require('express'),
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware'),
    router      = express.Router({mergeParams: true});    

//==========================
//      RESTful ROUTES
//==========================

//NEW COMMENT ROUTE
//shows create new comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

//CREATE COMMENT ROUTE
//create comment logic
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash('error', 'Something went wrong while adding comment');
                    console.log(err);
                } else {
                    //add username and id to comment then saves it to db
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //pushes found comment to comments array of found campground then saves to db
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added a new comment!');
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

//EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect('back')
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    })
})

//UPDATE COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment Updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

//DESTROY COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment Deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

module.exports = router;