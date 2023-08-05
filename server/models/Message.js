const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

const Message = model("Message", messageSchema);

module.exports = Message;
