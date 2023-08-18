const { WebSocket } = require("ws");
const { getTimestamp } = require("./getTimestamp");
const uuidv4 = require("uuid").v4;

// Map used to track users
const users = new Map();
// Map used to relate connections to userId
const connections = new Map();
// Set to track chat history
const chatMessages = [];
// Variable to track last received message
let lastReceivedMessage = null;

// handle message
async function handleMessage(message, connectionId, clients, HOSTPATHFORAPI) {
	console.log("Received message: ", message.toString());
	const dataFromClient = JSON.parse(message.toString());
	const timestamp = getTimestamp();

	if (JSON.stringify(dataFromClient) === JSON.stringify(lastReceivedMessage)) {
		console.log("Identical message received, ignoring.");
		return;
	}

	// Update the last received message
	lastReceivedMessage = dataFromClient;

	if (dataFromClient.type === "userevent") {
		const { first_name, userId } = dataFromClient;
		users.set(userId, { first_name });
		connections.set(connectionId, userId);
		const content = `${first_name} joined the chat`;
		chatMessages.push({ timestamp, content, connectionId });
		saveMessageInDb(content, userId, timestamp, HOSTPATHFORAPI);
	} else if (dataFromClient.type === "chatevent") {
		const { first_name, content, userId } = dataFromClient;
		const userContent = `${first_name}: ${content}`;
		chatMessages.push({ timestamp, content: userContent, connectionId });
		saveMessageInDb(userContent, userId, timestamp, HOSTPATHFORAPI);
	}

	const json = { chatMessages };

	broadcastMessage(json, clients);
}

function handleDisconnect(connectionId, clients, HOSTPATHFORAPI) {
	const userId = connections.get(connectionId);
	if (!userId) {
		return;
	}

	const userFirstName = users.get(userId).first_name;
	if (!userFirstName) {
		return;
	}

	const timestamp = getTimestamp();

	const content = `${userFirstName} left the chat`;
	if (
		JSON.stringify(lastReceivedMessage) ===
		JSON.stringify({ timestamp, content, connectionId })
	) {
		console.log("Identical message received, ignoring.");
		return;
	}
	console.log(userFirstName, " disconnected");
	chatMessages.push({ timestamp, content, connectionId });
	lastReceivedMessage = { timestamp, content, connectionId };
	clients[connectionId].close();
	delete clients[connectionId];
	connections.delete(connectionId);
	users.delete(userId);
	saveMessageInDb(content, userId, timestamp, HOSTPATHFORAPI);
	const json = { chatMessages };
	broadcastMessage(json, clients);
}

// broadcast message to all connected clients
function broadcastMessage(json, clients) {
	// convert json to string
	const data = JSON.stringify(json);
	// loop through clients object to send data to each client
	for (const connectionId in clients) {
		const client = clients[connectionId];
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	}
}

async function saveMessageInDb(content, userId, timestamp, HOSTPATHFORAPI) {
	// generate the right path to the api endpoint
	const url = `${HOSTPATHFORAPI}/api/message/create`;
	try {
		const newMessage = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content, userId, timestamp }),
		});
		if (!newMessage.ok) throw new Error("Error saving message");
		const newMessageObj = await newMessage.json();
	} catch (err) {
		console.error(err);
	}
}

module.exports = { broadcastMessage, handleMessage, handleDisconnect };
