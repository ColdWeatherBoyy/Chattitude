import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { Box, Input, Button, Text } from "@chakra-ui/react";
import Messages from "../components/Messages";

const WS_URL = "ws://127.0.0.1:3001";

const WebSocketTest = () => {
	const [username, setUsername] = useState("");
	const [connectionState, setConnectionState] = useState(false);
	const [loginState, setLoginState] = useState(false);
	const [chatMessage, setChatMessage] = useState("");

	const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
		onOpen: () => {
			setConnectionState(true);
			console.log("WebSocket connection established");
		},
		share: true,
		filter: () => false,
		retryOnError: true,
		shouldReconnect: () => true,
	});

	function handleUsernameChange(event) {
		setUsername(event.target.value);
	}

	function handleLogin() {
		if (!username) return;
		sendJsonMessage({
			username,
			type: "userevent",
		});
		setLoginState(true);
		document.getElementById("username-field").disabled = true;
		document.getElementById("login-button").disabled = true;
	}

	function handleChatMessageChange() {
		setChatMessage(document.getElementById("chat-message-field").value);
	}

	function handleSendMessage() {
		sendJsonMessage({
			username,
			content: chatMessage,
			type: "chatevent",
		});
		setChatMessage("");
	}

	return (
		<>
			<Box
				style={{
					width: "70vw",
					height: "100vh",
					padding: "20px",
				}}
			>
				<Text>Enter username here:</Text>
				<Input
					id="username-field"
					onChange={handleUsernameChange}
					onKeyUp={(event) => {
						if (event.key === "Enter") handleLogin();
					}}
				/>
				<Button id="login-button" onClick={handleLogin}>
					Login
				</Button>
				<Box
					style={{
						border: "1px solid green",
					}}
				>
					<Text>
						Connection Status: {connectionState ? "connected" : "not connected"}
					</Text>
					<Text>Login Status: {loginState ? "logged in" : "not logged in"}</Text>
				</Box>

				{loginState && (
					<>
						<Text>Messages:</Text>
						<Messages WS_URL={WS_URL} />
						<Input
							id="chat-message-field"
							onChange={handleChatMessageChange}
							value={chatMessage}
							onKeyUp={(event) => {
								if (event.key === "Enter") handleSendMessage();
							}}
						/>
						<Button id="chat-send-button" onClick={handleSendMessage}>
							Send
						</Button>
					</>
				)}
			</Box>
		</>
	);
};

export default WebSocketTest;
