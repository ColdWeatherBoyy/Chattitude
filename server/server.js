// **************************************
// BEGIN WEBSOCKET CODE
// **************************************

// COMBINED SETUP
const path = require("path");
const express = require("express");
const { createServer } = require("http");
require("dotenv").config();

const { WebSocket, WebSocketServer } = require("ws");
const app = express();
const server = createServer(app);
const uuidv4 = require("uuid").v4;
const wsServer = new WebSocketServer({ server });
const PORT = process.env.PORT || 3001;

const { getTimestamp } = require("./utils/getTimestamp");

// object tracks client connections
const clients = {};
// object tracks users
const users = {};
// user activity history
const chatMessages = [];
// event type definitions

// HELPERS
// broadcast message
function broadcastMessage(json) {
	const data = JSON.stringify(json);
	for (const userId in clients) {
		const client = clients[userId];
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	}
}

// handle message
function handleMessage(message, userId) {
	const dataFromClient = JSON.parse(message.toString());
	const timestamp = getTimestamp();

	if (dataFromClient.type === "userevent") {
		if (!users[userId]) {
			users[userId] = dataFromClient;
			const { first_name } = dataFromClient;
			const content = `${first_name} joined the chat`;
			chatMessages.push({ timestamp, content, userId });
		}
	} else if (dataFromClient.type === "chatevent") {
		const { first_name, content } = dataFromClient;
		const userContent = `${first_name}: ${content}`;
		chatMessages.push({ timestamp, content: userContent, userId });
	}
	const json = { chatMessages };

	broadcastMessage(json);
}

// websocket disconnect
function handleDisconnect(userId) {
	const user = users[userId];

	if (!user) {
		return;
	}

	const timestamp = getTimestamp();

	const { first_name } = user;
	const content = `${first_name} left the chat`;
	const json = { type: "userevent" };
	console.log(first_name, " disconnected");
	chatMessages.push({ timestamp, content });
	json.data = { users, chatMessages };
	delete clients[userId];
	delete users[userId];
	broadcastMessage(json);
}

// websocket connection setup
wsServer.on("connection", function (connection) {
	// Generate a unique code for every user
	const userId = uuidv4();
	console.log("Received a new connection");
	// Store the new connection and handle messages
	clients[userId] = connection;
	connection.on("message", (message) => handleMessage(message, userId));
	// User disconnected
	connection.on("close", () => handleDisconnect(userId));
});

// **************************************
// END WEBSOCKET CODE
// **************************************

const db = require("./db/connection");
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use("/", routes);

db.once("open", () => {
	console.log("DB connection established");
	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});
