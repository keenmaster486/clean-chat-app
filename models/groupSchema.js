const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema(
{
	users: [{type: Schema.Types.ObjectId, ref: 'User'}], //all the users in the group
	admins: [{type: Schema.Types.ObjectId, ref: 'User'}], //the admins
	name: {type: String, required: true}, //name of group
	categories: [{type: String, required: true}], //array of categories
	topic: {type: String, required: true}, //string containing topic, may be anything
	type: {type: String, required: true}, //whether 'DM' or 'std'
	private: {type: Boolean, required: true}, //whether public or private (false or true)
	joinpolicy: {type: Number, required: true}, //join policy: 0=any, 1=request/invite, 2=invite only
	allowinvite: {type: Boolean, required: true}, //whether to allow non-admins to invite other users
	messages: [{type: Schema.Types.ObjectId, ref: 'Message'}] //array of Messages
	// messages:[
	// 	{
	// 		user: {type: Schema.Types.ObjectId, ref: 'User'},
	// 		text: {type: String, required: true},
	// 		image: String,
	// 		video: String,
	// 		url: String
	// 	}
	// ]
});

const Group = new mongoose.model('Group', groupSchema);

module.exports = Group;