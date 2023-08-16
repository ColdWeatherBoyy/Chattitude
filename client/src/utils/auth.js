export const validateToken = async () => {
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

export const validateTokenForDisplay = async () => {
	try {
		const response = await fetch("/api/user/validate", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		const { first_name: firstName, _id: userId } = data.user;
		// return first name and true
		return { firstName, userId, valid: true };
	} catch (error) {
		return false;
	}
};

export const logout = async () => {
	try {
		const response = await fetch("/api/user/logout", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error logging out");
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
	}
};
