import { Box, Text, Flex } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { getMoreMessages } from "../utils/messageHelpers";
import Loader from "./Loader";

// Messages component for the app, which displays the messages in the chat box. Child component of GlobalChat
const Messages = ({ lastJsonMessage, firstName, messages, setMessages }) => {
	// ******************************************************
	// ****************  Messages States *********************
	// ******************************************************

	// State for load more messages
	const [loadMoreState, setLoadMoreState] = useState(false);

	// ******************************************************
	// ****************  Messages Refs ***********************
	// ******************************************************

	// UseRef to detect scrollability of chat box
	const scrollableRef = useRef();

	// ******************************************************
	// ****************  Messages Functions *****************
	// ******************************************************

	// Handles getting more messages from the db for the chat box
	const handleGetMoreMessages = () => {
		// set load more state for scrolling
		setLoadMoreState(true);
		// delay the call (to display the loader a bit longer)
		setTimeout(() => {
			// call helper function to get more messages
			getMoreMessages(messages, setMessages);
		}, 500);
	};

	// Add new message to messages array
	const renderNewMessage = async () => {
		// if there is a new message, add it to the messages array
		// lastJsonMessage is passed down from GlobalChat and is part of the useWebSocket hook
		if (lastJsonMessage) {
			setMessages((messages) => [
				...messages,
				lastJsonMessage.chatMessages[lastJsonMessage.chatMessages.length - 1],
			]);
		}
	};

	// ******************************************************
	// ****************  Messages UseEffects ****************
	// ******************************************************

	// Render new message when lastJsonMessage changes
	useEffect(() => {
		renderNewMessage();
	}, [lastJsonMessage]);

	// scroll to the bottom of the chat box on mount and when a new message is sent, if the user has not clicked load more
	useEffect(() => {
		// Scroll to the bottom of the chat box
		if (loadMoreState) {
			setLoadMoreState(false);
		} else {
			// scroll to the bottom of the chat box
			scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<Box
			maxH="60vh"
			overflowY="scroll"
			overflowX="hidden"
			// custom scrollbar
			css={{
				"&::-webkit-scrollbar": {
					width: 10,
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
			// ref for scrollability
			ref={scrollableRef}
			display="flex"
			flexDirection="column"
			p={2}
			border="2px solid"
			borderColor="gray.300"
			boxShadow="inner"
			borderRadius={8}
			bg="gray.200"
		>
			{/* Conditional rendering of Loader or clickable Load More... to get more messages */}
			{loadMoreState ? (
				<Flex
					alignItems="center"
					justifyContent="center"
					h="40px"
					position="relative"
					mt={6}
					mb={8}
				>
					<Loader />
				</Flex>
			) : (
				<Text
					alignSelf="center"
					fontSize={14}
					as="a"
					cursor="pointer"
					color="gray.600"
					onClick={handleGetMoreMessages}
					mb={2}
				>
					Load More...
				</Text>
			)}
			{/* Map through messages array and display messages */}
			{messages &&
				messages.map((message, index) => {
					const { timestamp, content } = message;
					let type;
					let messageContent;
					let userName;
					// Break content apart by : to style separately
					// There is redundancy with how the message is being created on the back end, but this is a temporary solution
					if (content.includes(":")) {
						const firstColonIndex = content.indexOf(":");
						userName = content.slice(0, firstColonIndex);
						messageContent = content.slice(firstColonIndex + 1);
						type = "chatevent";
					} else {
						type = "userevent";
						messageContent = content;
					}
					return (
						<Flex
							key={`message${index}`}
							mb={1}
							w={type === "chatevent" ? "100%" : "fit-content"}
							alignSelf={type === "chatevent" ? "flex-start" : "center"}
							direction="column"
							bg="gray.50"
							border="1px solid"
							borderColor="gray.100"
							color="black"
							borderRadius={8}
							px={4}
							py={3}
							boxShadow="sm"
						>
							{/* Conditional rendering depending on type of event */}
							{type === "chatevent" ? (
								<Flex w="100%" justifyContent="space-between" alignItems="center">
									<Flex alignItems="center">
										<Text
											color={userName === firstName ? "brand.300" : "red.400"}
											fontWeight="bold"
											fontSize="sm"
										>
											{userName}:
										</Text>
										<Text
											fontSize="md"
											px={4}
											wordBreak="break-word"
											whiteSpace="pre-wrap"
										>
											{messageContent}
										</Text>
									</Flex>
									<Text fontSize="2xs" color="gray.600">
										{timestamp}
									</Text>
								</Flex>
							) : (
								<Flex
									color="gray.600"
									flexDirection="column"
									alignItems="center"
									fontSize="2xs"
								>
									<Text>
										{messageContent} - {timestamp}
									</Text>
								</Flex>
							)}
						</Flex>
					);
				})}
		</Box>
	);
};

export default Messages;
