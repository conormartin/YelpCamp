var express     = require('express');
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware'),
    router      = express.Router();

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
router.post("/", middleware.isLoggedIn, function(req, res){
    // get user input from form and saves as an object
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    console.log(req.user)
    var newCampground = {name:name, price:price, image:image, description:description, author:author};
    
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground Updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

//DESTROY ROUTE 
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground Deleted');
            res.redirect('/campgrounds');
        }
    })
})

module.exports = router;