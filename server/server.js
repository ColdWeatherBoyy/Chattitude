// Set up server and websocket connection
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
const HOSTPATHFORAPI = process.env.HOSTPATHFORAPI || "http://localhost:3001";

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
	connection.on("message", (message) =>
		handleMessage(message, connectionId, clients, HOSTPATHFORAPI)
	);
	// User disconnected
	connection.on("close", () => handleDisconnect(connectionId, clients, HOSTPATHFORAPI));
});

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
