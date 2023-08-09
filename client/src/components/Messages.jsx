import { Box, Text, Flex } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const Messages = ({ lastJsonMessage }) => {
	const [messages, setMessages] = useState([]);
	const [loadMoreState, setLoadMoreState] = useState(false);
	const scrollableRef = useRef();

	// functions to get Messages from the database

	// get the most recent twenty messages from the database
	async function getMessages() {
		try {
			// get the last twent messages from the database
			const mostRecentTwentyMessages = await fetch("/api/message/get/mostRecentTwenty", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!mostRecentTwentyMessages.ok)
				throw new Error("Error getting last hour of chat");
			const data = await mostRecentTwentyMessages.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	}

	// get the next twenty messages from the database
	async function getMoreMessages() {
		try {
			// set load more state for scrolling
			setLoadMoreState(true);
			// get the message Id for the last message in the chat box
			const lastMessageId = messages[0]._id;
			// get the next twenty messages from the database, given the last message
			const nextTwentyMessages = await fetch(
				`/api/message/get/nextTwentyMessages/${lastMessageId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!nextTwentyMessages.ok) throw new Error("Error getting next twenty messages");
			const data = await nextTwentyMessages.json();
			// update state with the new messages
			setMessages((messages) => [...data, ...messages]);
		} catch (err) {
			console.log(err);
		}
	}

	// determine where to get message data from
	async function fetchData() {
		if (!lastJsonMessage || lastJsonMessage.chatMessages.length === 0) {
			const data = await getMessages();
			setMessages(data);
		} else {
			setMessages((messages) => [
				...messages,
				lastJsonMessage.chatMessages[lastJsonMessage.chatMessages.length - 1],
			]);
		}
	}

	// get messages on mount and when a new message is sent
	useEffect(() => {
		fetchData();
	}, [lastJsonMessage]);

	// scroll to the bottom of the chat box on mount and when a new message is sent, if the user has not clicked load more
	useEffect(() => {
		// Scroll to the bottom of the chat box
		if (loadMoreState) {
			setLoadMoreState(false);
		} else {
			scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			<Box
				minHeight="2rem"
				h="50vh"
				overflowY="scroll"
				ref={scrollableRef}
				display="flex"
				flexDirection="column"
				p={2}
				boxShadow="inner"
				border="1px solid gray.300"
			>
				<Text
					alignSelf="center"
					fontSize={14}
					as="a"
					cursor="pointer"
					color="gray.500"
					onClick={getMoreMessages}
				>
					Load More...
				</Text>
				{messages &&
					messages.map((message, index) => {
						const { timestamp, content } = message;
						let type;
						let messageContent;
						let firstName;
						// break content apart by : to style separately
						if (content.includes(":")) {
							[firstName, messageContent] = content.split(":");
							type = "chatevent";
						} else {
							type = "userevent";
							messageContent = content;
						}
						return (
							<>
								<Flex
									key={`message${index}`}
									mb={1}
									// w={type === "chatevent" ? "100%" : "25%"}
									w="100%"
									direction="column"
									bg="gray.50"
									border="1px solid"
									borderColor="gray.100"
									color="black"
									borderRadius={8}
									px={3}
									py={1}
									boxShadow="sm"
									fontSize={type === "chatevent" ? "md" : "2xs"}
								>
									{type === "chatevent" ? (
										<Flex w="100%" justifyContent="space-between" alignItems="center">
											<Text>
												{firstName}: {messageContent}
											</Text>
											<Text fontSize="2xs">{timestamp}</Text>
										</Flex>
									) : (
										<Flex flexDirection="column" alignItems="center">
											<Text>{messageContent}</Text>
										</Flex>
									)}
								</Flex>
							</>
						);
					})}
			</Box>
		</>
	);
};

export default Messages;
