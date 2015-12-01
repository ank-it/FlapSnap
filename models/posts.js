var mongoose = require('mongoose');

var ImagePostsSchema = new mongoose.Schema({
	title : String,
	link : String
});

mongoose.model('Post', ImagePostsSchema );