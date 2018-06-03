var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// Array of objects
var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
    {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"},
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
    {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"},
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
    {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"},
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&s=dd23e6038cd7a8421453675bd5695062&auto=format&fit=crop&w=959&q=80"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1486082570281-d942af5c39b7?ixlib=rb-0.3.5&s=c64bd8c13d331948149baf2a7e2ebf30&auto=format&fit=crop&w=1051&q=80"},
    {name: "Mountain Goats Rest", image: "https://images.unsplash.com/photo-1513781419235-2988ecacab83?ixlib=rb-0.3.5&s=e9d79491cf0eb6be2e25efdc62381fee&auto=format&fit=crop&w=1050&q=80"}
]

app.get("/", function(req,res) {
    res.render("landing");
})

// pass capmgrounds array into ejs file
app.get("/campgrounds", function(req,res) {
    res.render("campgrounds", {campgrounds:campgrounds});
})

// post request to campgrounds, sends new data then displays updated page
app.post("/campgrounds", function(req, res){
    // get user input from form
    var name = req.body.name;
    var image = req.body.image;
    // save input as an object
    var newCampground = {name:name, image:image};
    // push object to the array
    campgrounds.push(newCampground);
    // redirect back to campgrounds page(redirect defaults as get request)
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs")
})


app.listen(8000, function() {
    console.log("YelpCamp Server has Started!");
});