// Set up server and websocket connection

// Import dependencies
const path = require("path");
const express = require("express");
const { createServer } = require("http");
require("dotenv").config();
const uuidv4 = require("uuid").v4;
const { handleMessage, handleDisconnect } = require("./utils/serverHelper");
const db = require("./db/connection");
const routes = require("./routes");

// Express setup
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Websocket setup
const { WebSocketServer } = require("ws");
const wsServer = new WebSocketServer({ server });

// Object to track client connections
const clients = {};

// websocket connection setup
wsServer.on("connection", function (connection) {
	// Generate a unique id for every connection
	const connectionId = uuidv4();
	console.log("Received a new connection");
	// Store the new connection and handle messages
	clients[connectionId] = connection;

	// User sent a message, either userevent or a chatevent
	connection.on("message", (message) => handleMessage(message, connectionId, clients));
	// User disconnected
	connection.on("close", () => handleDisconnect(connectionId, clients));
});

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "..", "client", "dist", "index.html"));
});

// Routes
app.use(routes);

// Connect to database and start server
db.once("open", () => {
	console.log("DB connection established");
	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

// export clients
module.exports = clients;
