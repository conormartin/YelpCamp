var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local')
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment"),
    User            = require('./models/user');

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

//creates new mongo database called yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
//lets express know to use public directory for css & js files
app.use(express.static(__dirname + "/public"));
//runs seedDB function to add new data to db for testing
// seedDB();

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

//requiring routes from refactored files
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(8000, function() {
    console.log("YelpCamp Server has Started!");
});