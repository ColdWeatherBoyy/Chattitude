import { Box } from "@chakra-ui/react";
import { get } from "mongoose";

const Messages = ({ lastJsonMessage }) => {
	async function getMessages() {
		// chat lastJsonMessage – if it's empty, get the last hour of chat from database
		// let messages = lastJsonMessage?.chatMessages || [];
		// if (messages.length === 0) {
		// get the last hour of chat from database
		const lastHourOfMessages = await fetch("/api/message/get", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!lastHourOfMessages.ok) throw new Error("Error getting last hour of chat");
		const data = await lastHourOfMessages.json();
		console.log(data);
		// } else {
		// 	return;
		// }
	}
	// getMessages();
	const messages = lastJsonMessage?.chatMessages || [];
	if (lastJsonMessage === null) {
		return <div>Loading...</div>;
	}

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
