var express = require('express');
var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = function(apiRoutes, passport) {
    // process the signup form
    apiRoutes.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/signup-success', // redirect to the secure profile section
        failureRedirect : '/api/failure-redirect', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // // process the login form
    // apiRoutes.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/api/profile', // redirect to the secure profile section
    //     failureRedirect : '/api/failure-redirect', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    apiRoutes.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/api/failure-redirect'
    }),
    function(req, res) {
        var string = encodeURIComponent(JSON.stringify(req.user));
        // res.redirect('/?valid=' + string);
        res.redirect('/api/profile?valid=' + string);
    });

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
        var user = JSON.parse(req.query.valid);
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, "my-secret-for-jwt", {
            expiresIn : 60*60*24
            // expiresInMinutes: 1440 // expires in 24 hours
        });
        // res.token = token;
        // res.statusMessage = "Log In Successfull";
        // res.status(200).end();  
        res.send({
            token:token,
            logIn:"success"
        })
    });

    // process the signup form
    apiRoutes.get('/signup-success', function(req, res, next){
        res.send({
            logIn:"sign up success"
        })
    });

    // apiRoutes.post('/verify-token', function(req, res, next) {
    //     res.send({
    //         logIn:"working"
    //     })
    // });

    apiRoutes.post('/verify-token', function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, "my-secret-for-jwt", function(err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    return res.status(200).send({
                        verified: true,
                        message: 'valid token'
                    });
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });
}