// ***************************************************************
// ***************** Authentification Functions ******************

// Function to validate token on page load – these should be combined
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
		const valid = true;
		return { firstName, userId, valid };
	} catch (error) {
		console.error(error);
		// redirect to login page
		// window.location.href = "/login";
	}
};

// Function to validate token on page load – these should be combined
export const validateTokenForDisplay = async () => {
	try {
		const response = await fetch("/api/user/validate", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.status === 401) {
			return { valid: false };
		}

		if (!response.ok) {
			return { valid: false };
		}
		const data = await response.json();
		const { first_name: firstName, _id: userId } = data.user;
		// return first name and true
		return { firstName, userId, valid: true };
	} catch (error) {
		return { valid: false };
	}
};

// Function to log user out
export const logout = async (userId) => {
	try {
		const response = await fetch("/api/user/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId }),
		});
		if (!response.ok) throw new Error("Error logging out");
		return response;
	} catch (error) {
		console.error(error);
	}
};
