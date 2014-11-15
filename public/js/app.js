var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var AppRouter = require('./routers/app-router.js');
var attachFastClick = require('fastclick');

function startApp() {
	var router = new AppRouter(function() {
		Backbone.history.start({
			pushState: true
		});
	});

	/**
	 * If a user clicks an anchor with [data-navigate='true'] then we want to
	 * hijack the click and navigate them to the href via backbone instead of
	 * the browser dealing with it.
	 */
	$(document).on('click', 'a[href]', function(ev) {
		if ($(this).attr('data-navigate')) {
			var href = $(this).attr('href');
			ev.preventDefault();

			router.navigate(href, {
				trigger: true
			});
		}
	});
}

startApp();

$(document).ready(function() {
	attachFastClick(document.body);
});
