var express = require('express');
var metascrapper = require('metascraper');
var URL = require('../models/url');
var authController = require('../auth');

module.exports = function(apiRoutes) {

	// route middleware to verify a token
	// apiRoutes.use(function(req, res, next) {
	// });

	// // Create endpoint /api/beers for Get
	apiRoutes.get('/urls', /*authController.isAuthenticated,*/ function(req, res) {
		// Use the Beer model to find all beer
		URL.find(function(err, beers) {
			if (err)
				res.send(err);

			res.json(beers);
		});
	});

	// Create endpoint /api/beer for POSTS
	apiRoutes.post('/urlScrapper', function(req, res) {
		// Set the beer properties that came from the POST data
		 console.log("here",  "req.body.url",  req.body.url)
		metascrapper
		.scrapeUrl(req.body.url)
		.then((metadata) => {
			console.log(metadata)
			var url = new URL({
				"name": req.body.url,
				"metadata": metadata
			});

			// Save the beer and check for errors
			url.save(function(err) {
				if (err)
					res.send(err);

				res.json(metadata);
			});
			// res.json(metadata)
		})
		// var beer = new Beer({
		// 	"name": req.body.name,
		// 	"type": req.body.type,
		// 	"quantity": req.body.quantity
		// });

		// // Save the beer and check for errors
		// beer.save(function(err) {
		// 	if (err)
		// 		res.send(err);

		// 	res.json({
		// 		message: 'Beer added to the locker!',
		// 		data: beer
		// 	});
		// });
	});

	return apiRoutes;
}