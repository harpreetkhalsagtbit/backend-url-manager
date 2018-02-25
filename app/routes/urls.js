var express = require('express');
var metascrapper = require('metascraper');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var URL = require('../models/url');
var authController = require('../auth');

module.exports = function(apiRoutes) {

	// route middleware to verify a token
	// apiRoutes.use(function(req, res, next) {
	// });

	// route middleware to verify a token
	apiRoutes.use(function(req, res, next) {
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, "my-secret-for-jwt", function(err, decoded) {
				if (err) {
					return res.json({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
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

	// // Create endpoint /api/urls for Get
	apiRoutes.get('/urls', /*authController.isAuthenticated,*/ function(req, res) {
        console.log("token....", req.decoded)
		// decode token

		var loggedInUserDetails = req.decoded;
		// Use the url model to find all url
		URL.find({
			"userId":loggedInUserDetails._id
		}, function(err, urls) {
			if (err)
				res.send(err);

			console.log("urls", urls)
			res.json(urls);
		});
	});

	// Create endpoint /api/urlScrapper for POSTS
	apiRoutes.post('/urlScrapper', function(req, res) {
		// Set the url properties that came from the POST data
		// console.log("here", "req.body.url", req.body.url)
		var loggedInUserDetails = req.decoded;
		metascrapper
			.scrapeUrl(req.body.url)
			.then((metadata) => {
				console.log(metadata)

				// fix: if url is null in metada
				metadata.url = metadata.url || req.body.url
				var url = new URL({
					"userId":loggedInUserDetails._id,
					"name": req.body.url,
					"metadata": metadata
				});

				// Save the url and check for errors
				url.save(function(err, data) {
					if (err)
						res.send(err);

					res.json(data);
				});
			})
	});

	// Create endpoint /api/urlScrapper for PUTS
	apiRoutes.put('/urlScrapper', function(req, res) {

		var loggedInUserDetails = req.decoded;
		console.log("here......", req.body);
		// Save the url and check for errors
		URL.update({
			"userId":loggedInUserDetails._id,
			_id: req.body.url._id
		},{
			"$set": {
				metadata: req.body.url.metadata
			}
		}, function(err, data) {
			console.log(data)
			if (err)
				res.send(err);

			URL.findOne({
				_id: req.body.id
			}, function(err, url) {
				if (err)
					res.send(err);

				res.json(url);
			});

		});
	});

	// Create endpoint /api/urlScrapper for PUTS
	apiRoutes.put('/urlScrapperPreview', function(req, res) {

		var loggedInUserDetails = req.decoded;
		metascrapper
			.scrapeUrl(req.body.url)
			.then((metadata) => {
				console.log(metadata)

				// fix: if url is null in metada
				metadata.url = metadata.url || req.body.url
				res.json({
					"name": req.body.url,
					"metadata": metadata
				})
			})
	});

	// Create endpoint /api/urlScrapper/:id for DELETE
	apiRoutes.delete('/urlScrapper/:id', function(req, res) {
		// Set the url properties that came from the POST data
		console.log("here", "req.body.url", req.params)
		var loggedInUserDetails = req.decoded;
		URL.remove({
			"userId":loggedInUserDetails._id,
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);

			res.send(true);
		});

	});

	return apiRoutes;
}