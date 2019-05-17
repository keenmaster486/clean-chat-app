const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
{
	userId: {type: Schema.Types.ObjectId, ref: 'User'},
	userdisplayname: {type: String, required: true},
	text: String,
	image: String,
	video: String,
	url: String
});

const Message = new mongoose.model('Message', messageSchema);

module.exports = Message;