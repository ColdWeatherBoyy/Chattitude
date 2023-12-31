const { WebSocket } = require("ws");
const { Message } = require("../models");
const { getTimestamp } = require("./getTimestamp");

// Map used to track users
const users = new Map();
// Map used to relate connections to userId
const connections = new Map();
// Set to track chat history
const chatMessages = [];
// Variable to track last received message
let lastReceivedMessage = null;

// ******************************************************
// ****************  Websocket Functions ****************
// ******************************************************

// handle message
const handleMessage = async (message, connectionId, clients) => {
	const dataFromClient = JSON.parse(message.toString());
	const timestamp = getTimestamp();

	// Check if the message is identical to the last received message if a userevent
	if (
		JSON.stringify(dataFromClient) === JSON.stringify(lastReceivedMessage) &&
		dataFromClient.type === "userevent"
	) {
		console.log("Identical message received, ignoring.");
		return;
	}

	// Update the last received message
	lastReceivedMessage = dataFromClient;

	// Handle the different types of messages
	if (dataFromClient.type === "userevent") {
		const { first_name, userId, type } = dataFromClient;
		users.set(userId, { first_name });
		connections.set(connectionId, userId);
		const content = "joined the chat";
		chatMessages.push({ first_name, content, timestamp, type, connectionId });
		saveMessageInDb(first_name, content, timestamp, type, userId);
	} else if (dataFromClient.type === "chatevent") {
		const { first_name, content, userId, type } = dataFromClient;
		chatMessages.push({ first_name, content, timestamp, type, connectionId });
		saveMessageInDb(first_name, content, timestamp, type, userId);
	}

	const json = { chatMessages };

	// Broadcast the json message to all clients
	broadcastMessage(json, clients);
};

// handle disconnect of a client
const handleDisconnect = (connectionId, clients) => {
	const userId = connections.get(connectionId);
	if (!userId) {
		return;
	}

	const first_name = users.get(userId).first_name;
	if (!first_name) {
		return;
	}

	const timestamp = getTimestamp();
	const type = "userevent";

	const content = "left the chat";
	if (
		JSON.stringify(lastReceivedMessage) ===
		JSON.stringify({ first_name, content, timestamp, type, userId, connectionId })
	) {
		console.log("Identical message received, ignoring.");
		return;
	}
	console.log(first_name, " disconnected");
	chatMessages.push({ first_name, content, timestamp, type, connectionId });
	lastReceivedMessage = { first_name, content, timestamp, type, connectionId };
	clients[connectionId].close();
	delete clients[connectionId];
	connections.delete(connectionId);
	users.delete(userId);
	saveMessageInDb(first_name, content, timestamp, type, userId);
	const json = { chatMessages };
	broadcastMessage(json, clients);
};

// broadcast message to all connected clients
const broadcastMessage = (json, clients) => {
	const usersNamesArr = Array.from(users.values());
	json.users = usersNamesArr.map((user) => user.first_name);

	// convert json to string
	const data = JSON.stringify(json);
	// loop through clients object to send data to each client
	for (const connectionId in clients) {
		const client = clients[connectionId];
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	}
};

// save message in database
const saveMessageInDb = async (first_name, content, timestamp, type, userId) => {
	try {
		await Message.create({
			content,
			userId,
			timestamp,
			type,
			first_name,
		});
	} catch (err) {
		console.error(err);
	}
};

module.exports = { broadcastMessage, handleMessage, handleDisconnect };
