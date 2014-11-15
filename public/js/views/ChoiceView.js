var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');
var cookie = require('./../utils/cookies.js');

/**
 * ChoiceView
 * Renders an individual choice that can be voted on.
 * 	- Handles whether or not they've voted, displays button or not.
 * 	- Handles a user voting, this triggers a socket.io event, a model.set event.
 *  - Handles the colour of the bar, based off of the choice's [key]
 */
module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.parent = options.parent; //Used to re-render all choices once a vote has been made
		this.choice = options.choice;
		this.key = options.key; //store the key of the choice in the array to be used when a vote is placed.
		this.hasVoted = cookie.hasVoted('polled.io', this.model.get('_id')); //polled-io is what the cookie is called when set via Node
		this.width = options.width; //width of the bar to initially animate to

		this.colors = [
			'#c0392b','#3498db','#2ecc71','#9b59b6','#1abc9c','#34495e',
			'#f1c40f','#e67e22','#ecf0f1','#95a5a6'
		];
	},
	events: {
		'click [data-action-vote]': 'vote',
	},


	render: function() {
		var template = require('../../templates/_choice.html');
		this.$el.html(template({
			model: this.model.toJSON(),
			choice: this.choice,
			key: this.key,
			hasVoted: this.hasVoted,
			width: this.width
		}));

		this.$el.find('.js-bar').css('background', this.colors[this.key]);

		return this;
	},


	vote: function(ev) {
		var key = $(ev.target).data('key'),
			choices = this.model.get('choices');

		this.model.set(('choices')[key].votes, ++choices[key].votes);
		this.model.save({}, {
			success: function() {
				this.parent.render(); //on a users first vote, start from a fresh view.
			}.bind(this),
			error: function(model, response) {
				console.log(response);
			}
		});
	},
});
