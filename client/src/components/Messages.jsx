import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Messages = ({ lastJsonMessage }) => {
	const [messages, setMessages] = useState([]);

	async function getMessages() {
		try {
			// get the last hour of chat from database
			const lastTwentyMessages = await fetch("/api/message/get/lastTwenty", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!lastTwentyMessages.ok) throw new Error("Error getting last hour of chat");
			const data = await lastTwentyMessages.json();
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

	return (
		<>
			<Box
				style={{
					border: "1px solid green",
					minHeight: "2rem",
				}}
			>
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
