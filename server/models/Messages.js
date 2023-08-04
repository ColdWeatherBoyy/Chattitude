const { Schema, model } = require("mongoose");

const messagesSchema = new Schema({
	message: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

const Messages = model("Messages", messagesSchema);

module.exports = Messages;
