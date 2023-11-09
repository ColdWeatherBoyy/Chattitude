const router = require("express").Router();
const { Message } = require("../../models");

// ******************************************************
// ****************  Message Get Routes *****************
// ******************************************************

// Get most recent twenty messages from DB
// /api/message/get/mostRecentTwenty
router.get("/get/mostRecentTwenty", async (req, res) => {
	try {
		const messageData = await Message.find({})
			.sort({ time: -1 })
			.limit(20)
			.populate("userId");
		const reversedMessages = messageData.sort((a, b) => a.time - b.time);
		res.status(200).json(reversedMessages);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get the next twenty messages from DB
// /api/message/get/nextTwentyMessages/:lastMessageId
router.get("/get/nextTwentyMessages/:lastDisplayedMessageId", async (req, res) => {
	const { lastDisplayedMessageId } = req.params;
	try {
		const lastDisplayedMessage = await Message.findById(lastDisplayedMessageId);
		if (!lastDisplayedMessage) {
			return res.status(404).json({ message: "Last message not found" });
		}

		const nextTwentyMessagesData = await Message.find({
			time: { $lt: lastDisplayedMessage.time },
		})
			.sort({ time: -1 })
			.limit(20)
			.populate("userId");
		const nextTwentyMessages = nextTwentyMessagesData.sort((a, b) => a.time - b.time);

		res.status(200).json(nextTwentyMessages);
	} catch (err) {
		res.status(400).json(err);
	}
});

// // Get all messages from DB
// // /api/message/get/
// router.get("/get/", async (req, res) => {
// 	try {
// 		const messageData = await Message.find({}).populate("userId");
// 		res.status(200).json(messageData);
// 	} catch (err) {
// 		res.status(400).json(err);
// 	}
// });

// ******************************************************
// ****************  Message Post Routes ****************
// ******************************************************

// Create a message
// api/message/create
router.post("/create", async (req, res) => {
	try {
		const { content, userId, timestamp, type, first_name } = req.body;
		const messageData = await Message.create({
			content,
			userId,
			timestamp,
			type,
			first_name,
		});

		console.log(messageData);

		res.status(200).json(messageData);
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
