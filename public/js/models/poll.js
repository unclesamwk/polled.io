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
     * Pass the model and the choices[index] to a route of
     * api/poll/:url/vote to increase the vote by 1 on the server and
     * send back the updated model, which will trigger a Socket.io event
     * to update all clients.
     */
    vote: function(index, url, next) {
        this.getByURL(url);
        this.url += '/vote';

        return Backbone.Model.prototype.save.call(this,
            {
                index: index
            },
            {
                success: function() {
                    next();
                },
                error: function(model, response) {
                    console.log(response);
                }
            }
        );
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
