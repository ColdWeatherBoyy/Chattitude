const router = require("express").Router();
const { User } = require("../../models");
const { signToken, auth } = require("../../utils/auth");
// const { handleLogout } = require("../../utils/serverHelper.js");
const clients = require("../../server.js");

// ******************************************************
// ****************  User Get Routes ********************
// ******************************************************

// Get User by ID route (available for all users if loggedIn)
// /api/user/get/:id
router.get("/get/:id", auth, async (req, res) => {
	try {
		if (req.user.id !== req.params.id) {
			return res.status(400).send({ error: "You are not authorized to view this user." });
		}

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send({ error: "User not found." });
		}

		res.json(user);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

// Get all Users route
// /api/user/get/
router.get("/get", auth, async (req, res) => {
	try {
		const authenticatedUser = await User.findById(req.user.data._id);

		if (!authenticatedUser) {
			return res.status(404).send({ error: "Authenticated user not found." });
		}

		const users = await User.find({});
		res.json(users);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

// Validate token route
// /api/user/get/validate
router.get("/validate/", auth, async (req, res) => {
	try {
		const decoded = req.user;
		if (!decoded) {
			return res.status(400).send({ error: "Invalid token." });
		}
		const user = await User.findById(decoded.id).select("-password");
		if (!user) {
			return res.status(404).send({ error: "User not found." });
		}
		res.json({ message: "Token validated!", user });
	} catch (error) {
		res.status(400).json(error);
	}
});

// ******************************************************
// ****************  User Post Routes *******************
// ******************************************************

// User create route
// /api/user/post/create
router.post("/post/create", async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;

		const user = await User.create({ first_name, last_name, email, password });

		// Sign JWT token here
		const token = signToken(user);

		// Send http only cookie
		res.cookie("chattitude-token", token, { httpOnly: true });

		res
			.status(200)
			.json({ message: `Account for ${first_name} ${last_name} created!`, user });
	} catch (err) {
		console.log("error", err);
		res.status(400).json({ error: err });
	}
});

// User login route
// /api/user/post/login
router.post("/post/login", async (req, res) => {
	try {
		let { email, password } = req.body;
		email = email.toLowerCase();
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).send({ error: "Email not found." });
		}

		const verified = await user.isCorrectPassword(password);

		if (!verified) {
			return res.status(400).send({ error: "Password is incorrect, please try again." });
		}

		// Sign JWT token here
		const token = signToken(user);

		// Send http only cookie
		res.cookie("chattitude-token", token, { httpOnly: true });

		res.json({ message: "Login successful!", user });
	} catch (error) {
		res.status(400).json(error);
	}
});

// Logout user/clear token
// /api/user/logout
router.post("/logout", (req, res) => {
	try {
		// Clear http only cookie
		res.clearCookie("chattitude-token");
		res.status(200).json({ message: "Logout successful!" });
	} catch (error) {
		res.status(400).json(error);
	}
});

// ******************************************************
// ****************  User Put Routes ********************
// ******************************************************

// Update User name, email, or password, usable route for all three separate update functions.
// /api/user/put/:id
router.put("/put/:id", auth, async (req, res) => {
	try {
		const {
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			confirmationNewPassword,
			existingPassword,
		} = req.body;

		const userId = req.params.id;

		// Make sure auth user is the same as user being updated
		if (req.user.id !== req.params.id) {
			return res
				.status(400)
				.send({ error: "You are not authorized to update this user." });
		}

		// Checks to make sure at least one field is being updated
		// add a check that at least one designated field is being updated
		if (!newFirstName && !newLastName && !newEmail && !newPassword) {
			return res.status(400).send("No updates provided.");
		}

		// Finds user by ID to check other user values and ensure user exists
		let userQuery = User.findById(userId).select("-password");
		if (newPassword) {
			userQuery = User.findById(userId);
		}

		const user = await userQuery;
		let changes = 0;

		if (!user) {
			return res.status(404).send({ error: "User not found." });
		}

		// Checks to see if new first name, last name, or email is provided and if it is different from existing info
		if (newFirstName && newFirstName !== user.first_name) {
			user.first_name = newFirstName;
			changes++;
		} else if (newFirstName && newFirstName === user.first_name) {
			return res
				.status(400)
				.json({ error: "New first name matches existing first name." });
		}

		if (newLastName && newLastName !== user.last_name) {
			user.last_name = newLastName;
			changes++;
		} else if (newLastName && newLastName === user.last_name) {
			return res.status(400).send({ error: "New last name matches existing last name." });
		}

		if (newEmail && newEmail !== user.email) {
			user.email = newEmail;
			changes++;
		} else if (newEmail && newEmail === user.email) {
			return res.status(400).send({ error: "New email matches existing email." });
		}

		// Checks to see if new password is provided, with appropriate confirmation checks
		if (newPassword) {
			// Checks to allow password rest and add new password to user
			if (!confirmationNewPassword) {
				return res.status(400).send("Please confirm your new password.");
			} else if (newPassword !== confirmationNewPassword) {
				// confirmation that new password typed twice matches
				return res.status(400).send({ error: "New passwords don't match." });
			} else if (!existingPassword) {
				// if resetting password, asks for existing password and new password typed twice
				return res.status(400).send({ error: "Please enter your existing password." });
			} else {
				const verified = await user.isCorrectPassword(existingPassword);

				if (!verified) {
					return res
						.status(400)
						.send({ error: "Your existing password is incorrect. Please try again." });
				} else {
					user.password = newPassword;
					changes++;
				}
			}
		}

		if (changes === 0) {
			return res.status(400).send({ error: "All info provided same as existing info." });
		}

		// Finally, update user info with new info
		const updatedUser = await user.save();

		// Update token
		const token = signToken(updatedUser);
		res.cookie("chattitude-token", token, { httpOnly: true });

		res.status(200).json({
			message: `Account for ${updatedUser.first_name} ${updatedUser.last_name} updated!`,
			updatedUser,
		});
	} catch (error) {
		return res.status(400).json(error);
	}
});

// ******************************************************
// ****************  User Delete Routes *****************
// ******************************************************

// Delete User by ID route
// Requires UI to ask user to retype email address to confirm deletion
// /api/user/delete/:id
router.delete("/delete/:id", auth, async (req, res) => {
	try {
		const { email, password } = req.body;

		console.log(email, password);

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send({ error: "User not found." });
		}

		const verification = await user.isCorrectPassword(password);
		if (!verification) {
			return res.status(400).send({ error: "Password does not match user record." });
		}

		if (email !== user.email) {
			return res.status(400).send({ error: "Email does not match user record." });
		}

		const deletedUser = await User.findByIdAndDelete(req.params.id);
		res.status(200).json({
			message: `Account for ${deletedUser.first_name} ${deletedUser.last_name} deleted!`,
		});
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
