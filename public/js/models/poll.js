var Backbone = require('backbone');
var _ = require('lodash');
var $ = require('jquery');
Backbone.$ = $;
var socketio = require('socket.io-client');

module.exports = Backbone.Model.extend({
	idAttribute: "_id",
	urlRoot: 'api/poll',

    /**
     * Fetch is overriden as we want to instantiate a socket.io connection
     * before a GET request to allow votes to be updated in real time.
     * More information can be found in app.js
     */
    fetch: function() {
        this.io = socketio.connect();

        //Event that is sent via Node when a PUT request is sent to /api/poll
        this.io.on('voted', function(data) {
            this.set(data);
        }.bind(this));

        return Backbone.Model.prototype.fetch.apply(this, arguments);
    },

	getByURL: function(url) {
		this.url = "/api/poll/" + url;
	},

    /**
     * Checks for empty title and requires at least two choices
     */
    validate: function(attrs) {
        var errors = {};

        if (!attrs.title) {
        	errors.title = {
        		message: 'Please enter a title',
        	}
        }

        if (attrs.choices.length < 2) {
        	errors.choices = true;
        }

        //If we return errors, even when empty, it thinks we've failed.
        if (!_.isEmpty(errors)) return errors;
    },

});
