const router = require("express").Router();
const { Message } = require("../../models");

// api/message/create
// create a message
router.post("/create", async (req, res) => {
	try {
		const { content, userId, timestamp } = req.body;
		const messageData = await Message.create({
			content,
			userId,
			timestamp,
		});

		res.status(200).json(messageData);
	} catch (err) {
		res.status(400).json(err);
	}
});

// get last hour of messages
// /api/message/get/lastHour
router.get("/get/lastHour", async (req, res) => {
	try {
		const messageData = await Message.find({
			time: {
				$gte: new Date(new Date() - 60 * 60 * 1000),
			},
		}).populate("userId");
		res.status(200).json(messageData);
	} catch (err) {
		res.status(400).json(err);
	}
});

// get all messages
// /api/message/get/
router.get("/get/", async (req, res) => {
	try {
		const messageData = await Message.find({}).populate("userId");
		res.status(200).json(messageData);
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
