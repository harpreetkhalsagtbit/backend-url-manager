var express = require('express');
var User = require('../models/user');

module.exports = function(apiRoutes, passport) {
    // process the signup form
    apiRoutes.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/signup-success', // redirect to the secure profile section
        failureRedirect : '/api/failure-redirect', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    apiRoutes.post('/login', passport.authenticate('local-login', {
        successRedirect : '/api/profile', // redirect to the secure profile section
        failureRedirect : '/api/failure-redirect', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    apiRoutes.get('/failure-redirect', function(req, res, next){
        res.statusMessage = "Log In Failed";
        res.status(400).end();
        // res.status(401)
        // res.send({
        //     logIn:"fail"
        // })
    });

    // process the login form
    apiRoutes.get('/profile', function(req, res, next){
        res.statusMessage = "Log In Successfull";
        res.status(200).end();
        // res.send({
        //     logIn:"success"
        // })
    });

    // process the signup form
    apiRoutes.get('/signup-success', function(req, res, next){
        res.send({
            logIn:"sign up success"
        })
    });
}