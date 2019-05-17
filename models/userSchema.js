const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
	username: {type: String, required: true, unique: true},
	usertype: {type: String, required: true},
	password: {type: String, required: true},
	displayname: {type: String, required: true},
	email: String,
	description: String
});

const User = new mongoose.model('User', userSchema);

module.exports = User;