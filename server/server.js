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

// server.listen(port, () => {
// 	console.log(`WebSocket server is running on port ${port}`);
// });

// object tracks client connections
const clients = {};
// object tracks users
const users = {};
// user activity history
const chatMessages = [];
// event type definitions

// HELPERS
// broadcast
function broadcastMessage(json) {
	const data = JSON.stringify(json);
	for (const userId in clients) {
		const client = clients[userId];
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	}
}

// message
function handleMessage(message, userId) {
	const dataFromClient = JSON.parse(message.toString());
	const json = { type: dataFromClient.type };

	if (dataFromClient.type === "userevent") {
		users[userId] = dataFromClient;
		chatMessages.push(`${dataFromClient.username} joined the chat`);
		json.data = { users, chatMessages };
	} else if (dataFromClient.type === "chatevent") {
		chatMessages.push(`${dataFromClient.username}: ${dataFromClient.content}`);
		editorContent = dataFromClient.content;
		json.data = { editorContent, chatMessages };
	}

	broadcastMessage(json);
}

// websocket disconnect
function handleDisconnect(userId) {
	console.log(`${userId} disconnected`);
	const json = { type: "userevent" };
	const username = users[userId]?.username || userId;
	chatMessages.push(`${username} left the chat`);
	json.data = { users, chatMessages };
	delete clients[userId];
	delete users[userId];
	broadcastMessage(json);
}

// websocket connection setup
wsServer.on("connection", function (connection) {
	// Generate a unique code for every user
	const userId = uuidv4();
	console.log("Recieved a new connection");

	// Store the new connection and handle messages
	clients[userId] = connection;
	console.log(`${userId} connected.`);
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
