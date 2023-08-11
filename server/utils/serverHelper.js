const { WebSocket } = require("ws");
const { getTimestamp } = require("./getTimestamp");
const { connection } = require("mongoose");

// Map used to track users
const users = new Map();
// Map used to relate connections to userId
const connections = new Map();
// Set to track chat history
const chatMessages = [];

// handle message
async function handleMessage(message, connectionId, clients, HOSTPATHFORAPI) {
	const dataFromClient = JSON.parse(message.toString());
	const timestamp = getTimestamp();

	if (dataFromClient.type === "userevent") {
		const { first_name, userId } = dataFromClient;
		if (!users.has(userId)) {
			users.set(userId, { first_name });
			connections.set(connectionId, userId);

			const content = `${first_name} joined the chat`;
			chatMessages.push({ timestamp, content, connectionId });
			saveMessageInDb(content, userId, timestamp, HOSTPATHFORAPI);
		}
	} else if (dataFromClient.type === "chatevent") {
		const { first_name, content, userId } = dataFromClient;
		const userContent = `${first_name}: ${content}`;
		chatMessages.push({ timestamp, content: userContent, connectionId });
		saveMessageInDb(userContent, userId, timestamp, HOSTPATHFORAPI);
	}

	const json = { chatMessages };
	console.log(Object.keys(clients));

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
	console.log(userFirstName, " disconnected");
	chatMessages.push({ timestamp, content, connectionId });
	clients[connectionId].close();
	delete clients[connectionId];
	connections.delete(connectionId);
	users.delete(userId);
	saveMessageInDb(content, userId, timestamp, HOSTPATHFORAPI);
	const json = { chatMessages };
	broadcastMessage(json, clients);
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
