var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PollSchema = new Schema({
	title: String,
	choices: [{
		choice: String,
		votes: Number
	}],
	url: String
});

module.exports = mongoose.model('Poll', PollSchema);
