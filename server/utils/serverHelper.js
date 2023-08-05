const { WebSocket } = require("ws");
const { getTimestamp } = require("./getTimestamp");

// Object used to track users
const users = {};
// Object used to relate connections to userId
const connections = {};
// Array to track chat history
const chatMessages = [];

// handle message
function handleMessage(message, connectionId, clients) {
	const dataFromClient = JSON.parse(message.toString());
	const timestamp = getTimestamp();

	if (dataFromClient.type === "userevent") {
		if (!users[dataFromClient.userId]) {
			const { first_name, userId } = dataFromClient;
			users[userId] = { first_name };
			connections[connectionId] = userId;
			const content = `${first_name} joined the chat`;
			chatMessages.push({ timestamp, content, connectionId });
		}
	} else if (dataFromClient.type === "chatevent") {
		const { first_name, content } = dataFromClient;
		const userContent = `${first_name}: ${content}`;
		chatMessages.push({ timestamp, content: userContent, connectionId });
	}
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

function handleDisconnect(connectionId, clients) {
	const userId = connections[connectionId];
	const userFirstName = users[userId].first_name;
	if (!userFirstName) {
		return;
	}

	const timestamp = getTimestamp();

	const content = `${userFirstName} left the chat`;
	const json = { type: "userevent" };
	console.log(userFirstName, " disconnected");
	chatMessages.push({ timestamp, content });
	json.data = { users, chatMessages };
	delete clients[connectionId];
	delete users[userId];
	broadcastMessage(json);
}

module.exports = { broadcastMessage, handleMessage, handleDisconnect };
