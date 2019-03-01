var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")  //if we require directory it will automatically look for index.js

//
// CAMPGROUND ROUTES
//

// INDEX - Shwo all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds : allCampgrounds})
        }
    })
})

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
})

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    //find the campgorund with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found!")
            res.redirect("back")
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name 
    var image = req.body.image
    var description = req.body.description
    var price = req.body.price
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, price:price, image:image, description:description, author: author}
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            //redirect 
            res.redirect("/campgrounds");
        }
    })
})


// DELETE - delete campground from DB
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
}) 


module.exports = router