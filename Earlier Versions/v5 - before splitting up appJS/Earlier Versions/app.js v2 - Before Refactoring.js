var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");

//creates new mongo database called yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


//Schema Setup describes database structure
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
//compile schema into a model called Campground
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(    
//     {
//         name: "Granite Hill", 
//         image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80",
//         description: "This is a huge granite hill, no bathrooms, no water. Beautiful granite hill!"
//     },  function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly created campground: ");
//             console.log(campground);
//         }
//     }
// );


// Array of objects
// var campgrounds = [
//     {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
//     {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"},
//     {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
//     {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"},
//     {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
//     {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"},
//     {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
//     {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"}
// ]

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
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err)
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(8000, function() {
    console.log("YelpCamp Server has Started!");
});