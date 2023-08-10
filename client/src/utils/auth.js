const validateToken = async () => {
	try {
		const response = await fetch("/api/user/validate", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Invalid token");
		const data = await response.json();
		const { first_name: firstName, _id: userId } = data.user;
		return { firstName, userId };
	} catch (error) {
		console.error(error);
		// redirect to login page
		window.location.href = "/login";
	}
};

export default validateToken;
