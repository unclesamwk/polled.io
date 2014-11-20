var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('lodash');
Backbone.$ = $;
var choiceInput = require('../views/ChoiceInputView.js');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.router = options.router;

		/**
		 * Listens to animations ending, if the target listened to is
		 * 'fadeOutLeft' (the animation that'll cause the screen to advance to view a poll)
		 * Then navigate them, else ignore the animation.
		 */
		this.$el.on('animationend webkitAnimationEnd', function(ev) {
			if (ev.target.className == 'fadeOutLeft') {
				this.remove().navigate();
			}
		}.bind(this));
		this.listenTo(this.model, 'invalid', this.showValidationErrors);
	},

	render: function() {
		var template = require('../../templates/_create-poll-form.html');

		this.$el.html(template());

		return this;
	},

	events: {
		'submit': 'createPoll',
		'focus .js-choice-input': 'appendInput',
		'keyup .js-title': 'removeValidation',
	},

	createPoll: function(ev) {
		var data = this.serializeForm();

		this.model.save(data, {
			success: function(poll) {
				this.$el.addClass('fadeOutLeft'); //this kick starts the navigation (see initialized event listener)
			}.bind(this)
		});

		ev.preventDefault();
	},

	/**
	 * Returns an object containing all of the choices and the poll title
	 * This object is then directly injected into the model.save().
	 */
	serializeForm: function() {
		var choices = [];

		_.each(this.$('.js-choice-input'), function(value, index) {
			var val = $(value).val();
			if (val) {
				choices.push({
					choice: val,
					votes: 0
				});
			}
		});

		return {
			title: this.$('.js-title-input').val(),
			choices: choices,
		};
	},

	/**
	 * Applies styling to invalid inputs, with messages where appropriate.
	 * As only two choices are required, only the first two inputs are styled.
	 */
	showValidationErrors: function(model, error) {
		var $pollTitle = $('.js-title'),
			$choiceInputs = $('.js-choice-input').slice(0,2),
			$submit = $('.js-submit');

		if (error.title) {
			$pollTitle.addClass('invalid');
			$pollTitle.find('.js-message').text(error.title.message);
			$pollTitle.find('.js-title-input').focus();
		}

		if (error.choices) {
		   $choiceInputs.addClass('invalid');
		} else {
			$choiceInputs.removeClass('invalid');
		}

		$submit.removeClass('shake');
		$submit.height(); //trigger a reflow to re-apply animation.
		$submit.addClass('shake');
	},

	removeValidation: function(ev) {
		if (this.model.isValid('title')) {
			$(ev.target).parent().removeClass('invalid');
		}
	},

	/**
	 * When a user tabs with an input focused, of which it is the last one, if * there's less than 10 choices available, a new input will be appended.
	 */
	appendInput: function(ev) {
		var count = $('.js-choice-input').length + 1;

		if ($(ev.target).parent().is('.js-choice:last-of-type')) {
			if (count < 11) {
				var input = new choiceInput({
					count: count
				}).render().el;
				$('.js-choices').append(input);
			}
		}
	},

	navigate: function() {
		this.router.navigate('poll/' + this.model.get('url'), {
			trigger: true
		});
	}
});
