import useWebSocket from "react-use-websocket";
import { Box } from "@chakra-ui/react";

const Messages = ({ WS_URL }) => {
	const { lastJsonMessage } = useWebSocket(WS_URL, {
		share: true,
	});

	const messages = lastJsonMessage?.data.chatMessages || [];

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
						return <Box key={`message${index}`}>{message}</Box>;
					})}
			</Box>
		</>
	);
};

export default Messages;
