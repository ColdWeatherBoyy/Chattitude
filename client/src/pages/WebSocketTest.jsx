import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

import { Box, Input, Button, Text } from "@chakra-ui/react";
import Messages from "../components/Messages";

const WS_URL = "ws://127.0.0.1:3001";

const WebSocketTest = () => {
	const [firstName, setFirstName] = useState("");
	const [connectionState, setConnectionState] = useState(false);
	const [chatMessage, setChatMessage] = useState("");

	useEffect(() => {
		const validateToken = async () => {
			try {
				const response = await fetch("/api/user/validate", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) throw new Error("Invalid token");
				const data = await response.json();
				setFirstName(data.user.first_name);
				sendJsonMessage({
					first_name: data.user.first_name,
					type: "userevent",
				});
			} catch (error) {
				console.error(error);
				// redirect to login page
				window.location.href = "/login";
			}
		};
		validateToken();
	}, []);

	const { sendJsonMessage, readyState, lastMessage, getWebsocket } = useWebSocket(
		WS_URL,
		{
			onOpen: () => {
				setConnectionState(true);
				console.log("WebSocket connection established");
			},
			share: true,
			retryOnError: true,
			shouldReconnect: () => true,
		}
	);

	function handleChatMessageChange() {
		setChatMessage(document.getElementById("chat-message-field").value);
	}

	function handleSendMessage() {
		if (readyState !== 1) {
			console.log("WebSocket not connected");
		} else if (!chatMessage) {
			console.log("No message to send");
		} else {
			sendJsonMessage({
				first_name: firstName,
				content: chatMessage,
				type: "chatevent",
			});
			setChatMessage("");
		}
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
				<Box
					style={{
						border: "1px solid green",
					}}
				>
					<Text>
						Connection Status: {connectionState ? "connected" : "not connected"}
					</Text>
					<Text></Text>
				</Box>

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
			</Box>
		</>
	);
};

export default WebSocketTest;
