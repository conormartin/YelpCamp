var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require('passport'),
    LocalStrategy = require('passport-local')
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment"),
    User        = require('./models/user');

//creates new mongo database called yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
//lets express know to use public directory for css & js files
app.use(express.static(__dirname + "/public"));
//runs seedDB function to add new data to db for testing
seedDB();

//==========================
//  PASSPORT CONFIGURATION
//==========================

app.use(require('express-session')({
    secret: 'Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware, makes current user available on every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

//==========================
//      RESTful ROUTES
//==========================

//Homepage
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
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
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
    res.render("campgrounds/new")
})

//SHOW ROUTE - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
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

//==========================
//     COMMENT ROUTES
//==========================

//shows create new comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

//create comment logic
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //pushes found comment to comments array of found campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground show page
})

//==========================
//      AUTH ROUTES
//==========================

//shows register form
app.get('/register', function(req, res) {
    res.render('register')
});

//handles sign up logic, goes to /campgrounds if sign up worked
app.post('/register', function(req, res) {
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
app.get('/login', function(req, res) {
    res.render('login');
});

//handles login logic, middleware checks if user logged in before callback runs
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res) {
    //empty
});

//logout route
app.get('/logout', function(req, res) {
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


app.listen(8000, function() {
    console.log("YelpCamp Server has Started!");
});