var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");
    
seedDB();
//creates new mongo database called yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req,res) {
    res.render("landing");
})

//INDEX ROUTE - shows all campgrounds
app.get("/campgrounds", function(req,res) {
    //get all campgrounds from db then pass into html file
    Campground.find({}, function(err,allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE ROUTE - adds new campgrounds to db
// post request to campgrounds, sends new data then displays updated page
app.post("/campgrounds", function(req, res){
    // get user input from form and saves as an object
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description:description};
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
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs")
})

//SHOW ROUTE - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
    //find the campground with provided ID & link id with comments using id reference
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err)
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(8000, function() {
    console.log("YelpCamp Server has Started!");
});