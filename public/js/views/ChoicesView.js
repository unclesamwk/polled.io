var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('lodash');
var choiceView = require('./../views/ChoiceView.js');

/**
 * ChoicesView
 * Parent view for ChoiceView that are shown on /poll/:url
 *  - Renders each invidual choice
 *  	- Animates the bar width for each choice (based off of their votes vs total votes)
 *  	- Passes through the choices [index] value so it can update the vote accordingly in ChoiceView
 */
module.exports = Backbone.View.extend({
	tagName: 'table',

	initialize: function() {
		/**
		 * We are listening for model changes, which will be triggered from sockets.io voted event.
		 * The event will then do model.set to trigger this change event. See ../models/poll.js for more.
		 */
		this.listenTo(this.model, 'change', function() {
			var choices = this.model.get('choices');
			this.updateBars(choices);
			this.updateVotes(choices);
		}.bind(this));
	},


	render: function() {
		this.$el.empty();

		_.each(this.model.get('choices'), function(value, index) {
			this.renderChoice(this.model, value, index);
		}.bind(this));

		_.defer(this.afterRender);

		return this;
	},
	renderChoice: function(poll, choice, index) {
		this.$el.append(new choiceView({
			model: poll,
			choice: choice,
			index: index,
			parent: this,
			width: this.getChoiceWidth(choice.votes)
		}).render().el);

		return this;
	},
	afterRender: function() {
		/**
		 * Do the initial bar animation. Annoyingly cannot be done via this.updateBars()
		 * Due to _.defers unwilingness to pass through 'this' scope.
		 */
		_.each($('.js-bar'), function(value, index) {
			$(value).css('width', $(value).data('width') + '%');
		});
	},


	/**
	 * Return a choices width % based off the total votes and it's respective votes.
	 */
	getVoteTotal: function() {
		var total = 0;
		_.each(this.model.get('choices'), function(value, index) {
			total += value.votes;
		});
		return total;
	},
	getChoiceWidth: function(votes) {
		return Math.round(votes / this.getVoteTotal() * 100) + '%';
	},


	/**
	 * Handles the updating votes and bar width, this has to be done
	 * 'manually' as refreshing via .render() will cause the bar to
	 * animate 0 to [width] everytime, where as we want incremental animations.
	 */
	updateBars: function(choices) {
		_.each($('.js-bar'), function(value, index) {
			var width = this.getChoiceWidth(choices[index].votes);
			$(value).css('width', width);
		}.bind(this));
	},
	updateVotes: function(choices) {
		_.each($('.js-vote'), function(value, index) {
			$(value).text(choices[index].votes);
		});
	},
});
