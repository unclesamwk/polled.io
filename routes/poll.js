var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	pollModel = require('../models/poll.js');

/**
 * Create Poll
 * Generates a unique URL to assign to the poll
 * Checks for clashes and continually generates until no clashes.
 * Saves the new poll
 */
exports.createPoll = function(req, res, next) {
	var poll = new pollModel({
		title: req.body.title,
		choices: req.body.choices
	});

	/**
	 * After the URL has been generated until there's no clash,
	 * inject the URL into the poll model and save it.
	 */
	getUniqueURL(function(url) {
		poll.set('url', url);
		poll.save(function(err, poll) {
			if (err) {
				return next(err);
			}
			res.send(200, poll);
		});
	});

};

exports.vote = function(req, res, next) {
	var poll = req.body,
		pollID = poll._id,
		index = poll.index;

	return pollModel.findById(pollID, function(error, foundPoll) {
		if (foundPoll) {
			foundPoll.choices[index].votes += 1;
			foundPoll.save(function(err) {
				if (err) {
					res.send(404);
				} else {
					next(foundPoll);
					writeCookie(req, res, pollID);
					res.json(200);
				}
			});
		} else {
			res.send(404);
		}
	});
};

exports.getPoll = function(req, res, next) {
	pollModel.findOne({
		url: req.params.url
	}, function(error, poll) {
		if (poll) {
			return res.send(200, poll);
		} else {
			return res.send(404);
		}
	})
};

/**
 * Generates a 6 character long string to be used as the URL to identify the
 * poll.
 * @return string
 */
function generateURL() {
	var text = '';
	var possible = 'abcdefghijklmnopqrstuvwxyz';

	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

/**
 * Writes a cookie to the users system.
 * If a cookie already exists, append the pollID as a comma seperated
 * list. Else, write it for the first time with no comma..
 */
function writeCookie(req, res, pollID) {
	var cookie = req.cookies['polled.io'];

	cookie = cookie ? cookie += ',' + pollID : cookie = pollID;

	res.cookie('polled.io', cookie, {
		expires: new Date(Number(new Date()) + 315360000000)
	});
}

/**
 * Generates a URL until it is unique. Self invoking function is ran,
 * then continually called until there's no clash. If there is a clash,
 * the function findURL will return its self to be re-ran.
 * When a unique URL is generated, it will be passed back so it can be used
 * to save the new poll.
 */
function getUniqueURL(cb) {
	(function findURL(callback) {
		var url = generateURL();
		pollModel.findOne({
			url: url
		}, function(error, poll) {
			return (poll) ? findURL(callback) : callback(url);
		});
	})(cb);
}
