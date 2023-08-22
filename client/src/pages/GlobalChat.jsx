import { useEffect, useState, useRef, forwardRef } from "react";
import useWebSocket from "react-use-websocket";
import { Box, Textarea, Flex, Heading } from "@chakra-ui/react";
import Messages from "../components/Messages";
import Header from "../components/Header";
import ResizeTextarea from "react-textarea-autosize";
import { validateToken } from "../utils/auth";

const WS_URL = "ws://127.0.0.1:3001";

const GlobalChat = () => {
	// State declarations
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");
	const [isButtonHovered, setIsButtonHovered] = useState(false);

	// useRef declarations
	const chatTextarea = useRef(null);

	// WebSocket Hook declarations
	const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(WS_URL, {
		onOpen: () => console.log("WebSocket connection opened"),
		onClose: () => console.log("WebSocket connection closed"),
		share: true,
		retryOnError: true,
		// set reconnect logic to attempt reconnect once every 3 seconds if connection fails, and is not intentional by the client
		shouldReconnect: (closeEvent) => {
			if (closeEvent.code === 1000) {
				return false;
			}
			console.log("WebSocket connection failed, retrying in 3 seconds");
			return true;
		},
	});

	// Custom Components
	const AutoResizeTextarea = forwardRef((props, ref) => {
		return <Textarea ref={ref} as={ResizeTextarea} autoFocus {...props} />;
	});

	// Send message to server
	const handleSendMessage = () => {
		if (readyState !== 1) {
			console.log("WebSocket not connected");
		} else if (!chatTextarea.current.value) {
			console.log("No message to send");
		} else {
			const content = chatTextarea.current.value;
			sendJsonMessage({
				first_name: firstName,
				userId: userId,
				content,
				type: "chatevent",
			});

			chatTextarea.current.value = "";
		}
	};

	// CSS Event Handlers
	const handleButtonHover = () => {
		setIsButtonHovered(true);
	};

	const handleButtonLeave = () => {
		setIsButtonHovered(false);
	};

	// useEffect declarations
	// Validate user token on page load, redirect to login page if invalid
	useEffect(() => {
		const validateAndExtract = async () => {
			const { firstName, userId } = await validateToken();
			setFirstName(firstName);
			setUserId(userId);

			sendJsonMessage({
				first_name: firstName,
				userId: userId,
				content: `${firstName} has joined the chat`,
				type: "userevent",
			});
		};

		// Check WebSocket connection state before sending the message
		if (readyState === 1) {
			validateAndExtract();
		} else {
			console.log("WebSocket not connected");
		}
	}, [readyState]);

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
			<Heading my={5}>Chat</Heading>
			<Flex
				bgColor="white"
				w="90%"
				h="75%"
				gap={5}
				p={5}
				m={5}
				borderRadius={8}
				flexDirection="column"
				justifyContent="space-between"
				boxShadow="xl"
			>
				<Messages lastJsonMessage={lastJsonMessage} firstName={firstName} />
				<Flex flexDirection="row" boxShadow="lg" borderRadius={8}>
					<AutoResizeTextarea
						ref={chatTextarea}
						onKeyDown={(event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								handleSendMessage();
							}
						}}
						borderTopRightRadius={0}
						borderBottomRightRadius={0}
						borderRight={0}
						rows={1}
						maxH="30vh"
						bgColor="gray.100"
						focusBorderColor="gray.200"
						boxShadow="inner"
						resize="none"
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
					<Box
						as="button"
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
						role="submit-message-button"
						onMouseEnter={handleButtonHover}
						onMouseLeave={handleButtonLeave}
						w="15vh"
					>
						Send
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
};

export default GlobalChat;
