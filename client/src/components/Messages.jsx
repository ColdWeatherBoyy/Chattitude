import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const Messages = ({ lastJsonMessage }) => {
	const [messages, setMessages] = useState([]);
	const [loadMoreState, setLoadMoreState] = useState(false);
	const scrollableRef = useRef();

	async function getMessages() {
		try {
			// get the last hour of chat from database
			const mostRecentTwentyMessages = await fetch("/api/message/get/mostRecentTwenty", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!mostRecentTwentyMessages.ok)
				throw new Error("Error getting last hour of chat");
			const data = await mostRecentTwentyMessages.json();
			console.log(data);
			return data;
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
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

		fetchData();
	}, [lastJsonMessage]);

	const getMoreMessages = async () => {
		try {
			setLoadMoreState(true);
			const lastMessageId = messages[0]._id;
			const data = await fetch(`/api/message/get/nextTwentyMessages/${lastMessageId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!data.ok) throw new Error("Error getting next twenty messages");
			const json = await data.json();
			console.log(json);
			setMessages((messages) => [...json, ...messages]);
		} catch (err) {
			console.log(err);
		}
	};

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
