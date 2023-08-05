import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

import { Box, Input, Button, Text } from "@chakra-ui/react";
import Messages from "../components/Messages";

const WS_URL = "ws://127.0.0.1:3001";

const WebSocketTest = () => {
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");
	const [connectionState, setConnectionState] = useState(false);
	const [chatMessage, setChatMessage] = useState("");

	const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(WS_URL, {
		onOpen: () => {
			setConnectionState(true);
			console.log("WebSocket connection established");
		},
		onClose: () => {
			setConnectionState(false);
			console.log("WebSocket connection closed");
		},
		share: true,
		retryOnError: true,
		shouldReconnect: () => true,
	});

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
				const firstName = data.user.first_name;
				const userId = data.user._id;
				setFirstName(firstName);
				setUserId(userId);
				sendJsonMessage({
					first_name: firstName,
					userId: userId,
					content: `${firstName} has joined the chat`,
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

	async function saveMessageInDb(content, userId) {
		try {
			const newMessage = await fetch("/api/message/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content, userId }),
			});
			if (!newMessage.ok) throw new Error("Error saving message");
			const newMessageObj = await newMessage.json();
		} catch (err) {
			console.error(err);
		}
	}

	function handleChatMessageChange() {
		setChatMessage(document.getElementById("chat-message-field").value);
	}

	function handleSendMessage() {
		if (readyState !== 1) {
			console.log("WebSocket not connected");
		} else if (!chatMessage) {
			console.log("No message to send");
		} else {
			const content = chatMessage;

			sendJsonMessage({
				first_name: firstName,
				userId: userId,
				content,
				type: "chatevent",
			});

			saveMessageInDb(content, userId);

			setChatMessage("");
		}
	}
	return (
		<>
			<Box width="70vw" height="100vh" padding="20px">
				<Box border="1px solid green">
					<Text>
						Connection Status: {connectionState ? "connected" : "not connected"}
					</Text>
					<Text></Text>
				</Box>

				<Text>Messages:</Text>

				<Messages lastJsonMessage={lastJsonMessage} />
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
