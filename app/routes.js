var express = require('express');
module.exports = function(app, passport) {

    // API ROUTES -------------------
    // get an instance of the router for api routes
    var apiRoutes = express.Router();

    // apply the routes to our application with the prefix /api
    app.use('/api', apiRoutes);

    // middleware that is specific to this router
    apiRoutes.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });

    // routes ======================================================================
    // Why we passed 'apiRoutes' instead of 'app'?
    // because we need prefix for 'routes` as 'api/',
    // passing 'app' will reset the prefix
    // 
    // Why require here?
    // we need to pass 'apiRoutes' before loading module(s)
    require('./routes/user')(apiRoutes, passport); // load our routes and pass in our app and fully configured passport
    require('./routes/beers')(apiRoutes); // load our routes and pass in our app
    require('./routes/urls')(apiRoutes); // load our routes and pass in our app
    // app.use('/beers', beers(app));

    // for dev purposes only
    app.get('*', function(res, req, next) {
        console.log("routes.js" )
        next();
    });
};