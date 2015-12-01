var mongoose = require('mongoose');

//Assuming USer schema to be for fb only

var userSchema = new mongoose.Schema({
	id : String ,
	access_token : String,
	name : String,
	profilePicture: String,
	email : String 
});

mongoose.model('User', userSchema );