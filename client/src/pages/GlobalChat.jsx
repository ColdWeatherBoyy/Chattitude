import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import {
	Box,
	Flex,
	Heading,
	Drawer,
	DrawerOverlay,
	DrawerHeader,
	DrawerBody,
	DrawerContent,
	useDisclosure,
} from "@chakra-ui/react";
import Messages from "../components/Messages";
import Header from "../components/Header";
import BrandButton from "../components/BrandButton";
import AutoResizeTextarea from "../components/ResizeTextarea";
import { validateToken } from "../utils/auth";
import { getMessages } from "../utils/messageHelpers";

const WS_URL = "ws://127.0.0.1:3001";

const GlobalChat = () => {
	// ******************************************************
	// ****************  GlobalChat States *******************
	// ******************************************************

	const [textareaInputValue, setTextareaInputValue] = useState("");
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");
	const [messages, setMessages] = useState([]);
	const [isButtonHovered, setIsButtonHovered] = useState(false);
	const [connectedUsers, setConnectedUsers] = useState([]);

	// ******************************************************
	// ****************  Additional Hooks *******************
	// ******************************************************

	// useDisclosure hook declarations
	const { isOpen, onOpen, onClose } = useDisclosure();

	// useRef declarations
	const chatTextarea = useRef(null);

	// WebSocket Hook declarations
	const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(WS_URL, {
		// readyState is a value provided by the hook to check the connection state of the webSocket
		// lastJsonMessage is a value provided by the hook to check the last message received from the webSocket
		// sendJsonMessage is a function provided by the hook to send messages to the webSocket server

		// Console.logs for debugging on Open and Close
		onOpen: () => console.log("WebSocket connection opened"),
		onClose: () => console.log("WebSocket connection closed"),
		share: true,
		retryOnError: true,
		// Set reconnect logic to attempt reconnect once every 3 seconds if connection fails, and is not intentional by the client
		shouldReconnect: (closeEvent) => {
			if (closeEvent.code === 1000) {
				return false;
			}
			console.log("WebSocket connection failed, retrying in 3 seconds");
			return true;
		},
	});

	// ******************************************************
	// ****************  GlobalChat Functions ***************
	// ******************************************************

	// Send message to server
	const handleSendMessage = () => {
		if (readyState !== 1) {
			console.log("WebSocket not connected");
		} else if (!textareaInputValue) {
			console.log("No message to send");
		} else {
			const content = textareaInputValue;
			sendJsonMessage({
				first_name: firstName,
				userId: userId,
				content,
				type: "chatevent",
			});

			setTextareaInputValue("");
		}
	};

	const validateAndExtract = async () => {
		const { firstName, userId } = await validateToken();
		setFirstName(firstName);
		setUserId(userId);

		const data = await getMessages();
		setMessages(data);

		sendJsonMessage({
			first_name: firstName,
			userId: userId,
			content: `${firstName} has joined the chat`,
			type: "userevent",
		});
	};

	// CSS Event Handlers
	const handleButtonHover = () => {
		setIsButtonHovered(true);
	};

	const handleButtonLeave = () => {
		setIsButtonHovered(false);
	};

	// ******************************************************
	// ****************  GlobalChat UseEffects **************
	// ******************************************************

	// Grabs the connected users from the lastJsonMessage and sets the connectedUsers state
	useEffect(() => {
		if (lastJsonMessage) {
			setConnectedUsers(lastJsonMessage.users);
		}
	}, [lastJsonMessage]);

	// Validate user token on page load, redirect to login page if invalid
	useEffect(() => {
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
			h="100%"
			minH="100vh"
			bgColor="gray.200"
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Header />
			<Heading my={5}>Chat</Heading>
			<BrandButton onClick={onOpen}>Online Users</BrandButton>
			{/* Online Users drawer */}
			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>
						<Flex alignItems="center" justifyContent="space-between">
							<Heading as="h3" size="md">
								Online Users
							</Heading>
							<Box ml={5} fontSize="md" onClick={onClose} cursor="pointer">
								X
							</Box>
						</Flex>
					</DrawerHeader>
					<DrawerBody>
						{connectedUsers.map((user) => (
							<Flex key={user} alignItems="center">
								<Box w="10px" h="10px" borderRadius="50%" bgColor="green.400" mr={2} />
								{user}
							</Flex>
						))}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
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
				{/* Messages Component */}
				<Messages
					lastJsonMessage={lastJsonMessage}
					firstName={firstName}
					messages={messages}
					setMessages={setMessages}
				/>
				<Flex flexDirection="row" boxShadow="lg" borderRadius={8}>
					{/* Use of AutoResizeTextArea for clean display that updates per user input, to a limit */}
					<AutoResizeTextarea
						ref={chatTextarea}
						textareaInputValue={textareaInputValue}
						setTextareaInputValue={setTextareaInputValue}
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
						// custom scrollbar
						css={{
							"&::-webkit-scrollbar": {
								width: 8,
							},
							"&::-webkit-scrollbar-track": {
								backgroundColor: "transparent",
							},
							"&::-webkit-scrollbar-thumb": {
								borderRadius: 8,
								border: "none",
								background: "#aaa",
							},
							"&::-webkit-scrollbar-thumb:hover": {
								background: "#999",
							},
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
