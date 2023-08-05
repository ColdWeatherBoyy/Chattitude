import useWebSocket from "react-use-websocket";
import { Box } from "@chakra-ui/react";

const Messages = ({ lastJsonMessage }) => {
	console.log("raw: ", lastJsonMessage);
	console.log("data: ", lastJsonMessage?.data);
	const messages = lastJsonMessage?.data?.chatMessages || [];
	if (lastJsonMessage === null) {
		return <div>Loading...</div>;
	}
	console.log(messages);

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
