var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('lodash');
Backbone.$ = $;

/**
 * ChoiceInputView
 * Handles the input fields for CreatePollView.js.
 * 	- Removal of an input field
 * 	- Updating placeholders
 */
module.exports = Backbone.View.extend({
	className: 'choice js-choice',

	initialize: function(options) {
		this.count = options.count;
	},
	events: {
		'click .js-remove-input': 'removeView',
	},


	render: function() {
		var template = require('../../templates/_choice-input.html');
		this.$el.html(template({
			count: this.count
		}));

		return this;
	},


	removeView: function() {
		this.remove();

		/**
		 * When a view is removed, update all of the Choice [count]
		 * placeholders to be in order again.
		 */
		var $choiceInputs = $('.js-choice-input');
		_.each($choiceInputs, function(value, index) {
			$(value).attr('placeholder', 'Choice ' + ++index);
		});
	},
});
