// Required dependencies from Mongoose
const { Schema, model } = require("mongoose");

// Create a new Schema for the Message model
const messageSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
	first_name: {
		type: String,
		required: true,
	},
	type: {
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
	timestamp: {
		type: String,
		required: true,
	},
});

// Create the Message model using the messageSchema
const Message = model("Message", messageSchema);

module.exports = Message;
