import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

import { Box, Input, Button, Text, Heading } from "@chakra-ui/react";
import Messages from "../components/Messages";
import Header from "../components/Header";

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

			setChatMessage("");
		}
	}
	return (
		<>
			<Box
				w="100vw"
				h="100vh"
				bgColor="gray.200"
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Header />
				<Heading my={5}>Messages:</Heading>
				<Box 
					bgColor="white"
					w="50%"
					h="100%"
					p={5}
					m={5}
					borderRadius={5}
					display="flex"
					flexDirection="column"
					justifyContent="space-between"
				>
					<Box>
						<Text
							fontWeight="bold"
						>
							Connection Status: {connectionState ? "Connected" : "Not Connected"}
						</Text>
						<Text></Text>
					</Box>

					

					<Messages lastJsonMessage={lastJsonMessage} />
					<Box
						display="flex"
						flexDirection="row"
					>
						<Input
							id="chat-message-field"
							onChange={handleChatMessageChange}
							value={chatMessage}
							onKeyUp={(event) => {
								if (event.key === "Enter") handleSendMessage();
							}}
						/>
						<Button id="chat-send-button" onClick={handleSendMessage} ml={4}>
							Send
						</Button>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default WebSocketTest;
