var express = require('express');
var router = express.Router();
var Campground = require('../models/campground')
var Comment = require('../models/comment');

//==========================
//      RESTful ROUTES
//==========================

//INDEX ROUTE - shows all campgrounds
router.get("/", function(req,res) {
    //get all campgrounds from db then pass into html file
    Campground.find({}, function(err,allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE ROUTE - adds new campgrounds to db
// post request to campgrounds, sends new data then displays updated page
router.post("/", isLoggedIn, function(req, res){
    // get user input from form and saves as an object
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, image:image, description:description, author:author};
    
    //saves newCampground object in the db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page(redirect defaults as get request)            
            res.redirect("/campgrounds");
        }
    })
})

//NEW ROUTE - shows form to create new db entery
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})

//SHOW ROUTE - shows more info about one campground
router.get("/:id", function(req,res){
    //find the campground with provided ID & link id with comments using id reference
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err)
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE


//UPDATE ROUTE


//middleware function to check if user logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;