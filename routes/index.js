var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")

router.get("/", function(req, res) {
    res.render("landing")
})

//
// AUTH ROUTES
//

// show register form
router.get("/register", function(req, res) {
    res.render("register")
})

//handle sign up
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully registered")
            res.redirect("/campgrounds")
        })
    })
})

// show login form
router.get("/login", function(req, res) {
    res.render("login")
})

router.post("/login", function (req, res, next) {
    passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Successfully logged in as " + req.body.username + "!"
    })(req, res);
});

router.get("/logout", function(req, res) {
    req.logout()
    req.flash("success", "Successfully logged out!")
    res.redirect("/campgrounds")
})

module.exports = router