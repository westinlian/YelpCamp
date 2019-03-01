var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    flash       = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes       = require("./routes/index")

// Uncomment to reset database
// seedDB();
// heroku has databaseurl set to mLab
// local has databaseurl set to localhost
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser : true});
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser : true}); // host on local
// mongoose.connect("mongodb://westin:*@ds159184.mlab.com:59184/yelpcamp_project", {useNewUrlParser : true}); //host on heroku
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Howdy partner, it's high noon!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server has Started!");
})
