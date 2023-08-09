import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Box, Input, Button, Text, Heading, border } from "@chakra-ui/react";
import Messages from "../components/Messages";
import Header from "../components/Header";

const WS_URL = "ws://127.0.0.1:3001";

const GlobalChat = () => {
	// State declarations
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");
	const [connectionState, setConnectionState] = useState(false);
	const [chatMessage, setChatMessage] = useState("");
	const [isButtonHovered, setIsButtonHovered] = useState(false);

	// WebSocket Hook declarations
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

	// Helper Functions

	// Validate token and set user info
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

	// Event Handlers
	const handleChatMessageChange = () => {
		setChatMessage(document.getElementById("chat-message-field").value);
	};

	// Send message to server
	const handleSendMessage = () => {
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
	};

	const handleButtonHover = () => {
		setIsButtonHovered(true);
	};

	const handleButtonLeave = () => {
		setIsButtonHovered(false);
	};

	// useEffect declarations
	// Validate user token on page load, redirect to login page if invalid
	useEffect(() => {
		validateToken();
	}, []);

	return (
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
				justifyContent="space-evenly"
				boxShadow="xl"
			>
				<Box width="fit-content" border="1px solid black" px={3} py={2} boxShadow="xl">
					<Text fontWeight="bold">
						You are: {connectionState ? "Connected!" : "Not Connected!"}
					</Text>
				</Box>

				<Messages lastJsonMessage={lastJsonMessage} />
				<Box display="flex" flexDirection="row" boxShadow="lg" borderRadius={8}>
					<Input
						id="chat-message-field"
						onChange={handleChatMessageChange}
						value={chatMessage}
						onKeyUp={(event) => {
							if (event.key === "Enter") handleSendMessage();
						}}
						borderTopRightRadius={0}
						borderBottomRightRadius={0}
						borderRight={0}
						bgColor="gray.100"
						focusBorderColor="gray.200"
						boxShadow="inner"
						borderColor={isButtonHovered ? "gray.100" : "gray.200"}
						_focus={{
							boxShadow: "none",
							bgColor: "gray.100",
							borderColor: isButtonHovered ? "gray.100" : "gray.200",
						}}
						_hover={{
							boxShadow: "none",
						}}
					/>
					<Button
						id="chat-send-button"
						onClick={handleSendMessage}
						borderTopLeftRadius={0}
						borderBottomLeftRadius={0}
						borderColor="gray.200"
						borderLeft="0"
						bgColor="gray.50"
						boxShadow={isButtonHovered ? "2xl" : "inner"}
						_hover={{ borderColor: "gray.100" }}
						_active={{
							borderColor: "transparent",
							bgColor: "gray.100",
							boxShadow: "inner",
							outline: "none",
						}}
						_focus={{
							outline: "none",
						}}
						role="submit-message"
						onMouseEnter={handleButtonHover}
						onMouseLeave={handleButtonLeave}
					>
						Send
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default GlobalChat;
