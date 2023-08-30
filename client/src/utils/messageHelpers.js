// get the most recent twenty messages from the database
export const getMessages = async () => {
	try {
		// get the last twenty messages from the database
		const mostRecentTwentyMessages = await fetch("/api/message/get/mostRecentTwenty", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!mostRecentTwentyMessages.ok)
			throw new Error("Error getting last twenty messages");
		const data = await mostRecentTwentyMessages.json();
		return data;
	} catch (err) {
		console.log(err);
	}
};

// get the next twenty messages from the database
export const getMoreMessages = async (messages, setMessages) => {
	try {
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
};
