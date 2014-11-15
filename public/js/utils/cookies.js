/**
 * Cookie management
 * Heavily taken from: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 * A cookie name is passed in, which returns a comma seperated list of pollIDs they've voted on
 * If the current pollID matches one within the array, they have voted.
 */
module.exports = {
	getCookie: function (cookieName) {
		if (!cookieName) { return null; }
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(cookieName).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},

	hasVoted: function(cookie, pollID) {
		var cookieArray = this.getCookie(cookie);

		/**
		 * Split the comma seperated string into an array of values
		 * See if the current pollID exists within the string, if it does, they
		 * have already voted.
		 */
		if (cookieArray) {
			cookieArray = cookieArray.split(',');
			return cookieArray.indexOf(pollID) >= 0;
		}

		return false;
	}
};
