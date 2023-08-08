import { Box, Text } from "@chakra-ui/react";
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
				border="1px solid green"
				minHeight="2rem"
				h="75vh"
				overflowY="scroll"
				ref={scrollableRef}
				display="flex"
				flexDirection="column"
			>
				<Text
					alignSelf="center"
					fontSize={12}
					as="a"
					cursor="pointer"
					onClick={getMoreMessages}
				>
					Load More...
				</Text>
				{messages &&
					messages.map((message, index) => {
						const { timestamp, content } = message;
						return (
							<Box key={`message${index}`}>
								{content}
								<span style={{ fontSize: "0.6rem", color: "grey", float: "right" }}>
									{timestamp}
								</span>
							</Box>
						);
					})}
			</Box>
		</>
	);
};

export default Messages;
