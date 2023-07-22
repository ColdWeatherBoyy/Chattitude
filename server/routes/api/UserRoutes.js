const router = require("express").Router();
const { User } = require("../../models");
const { signToken, auth } = require("../../utils/auth");

// **************************
// *** User GET Routes ***
// **************************

// Get User by ID route (available for all users if loggedIn)
// /api/user/get/:id
router.get("/get/:id", auth, async (req, res) => {
	try {
		const authenticatedUser = await User.findById(req.user.data._id);

		if (!authenticatedUser) {
			return res.status(404).send({ error: "Authenticated user not found." });
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

// **************************
// *** User Post Routes ***
// **************************

// User create route
// /api/user/post/create
router.post("/post/create", async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;

		const user = await User.create({ first_name, last_name, email, password });

		// add JWT here
		const token = signToken(user);

		res
			.status(200)
			.json({ message: `Account for ${first_name} ${last_name} created!`, user, token });
	} catch (err) {
		if (err.code === 11000 && err.keyPattern && err.keyValue) {
			// Duplicate key error for email field
			const { email } = err.keyValue;
			return res.status(400).json({ error: `Email '${email}' is already in use.` });
		}
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
			return res.status(400).send({ error: "Password does not match." });
		}

		// add JWT here
		const token = signToken(user);

		res.json({ message: "Login successful!", token, user });
	} catch (error) {
		res.status(400).json(error);
	}
});

// **************************
// *** User Put Routes ***
// **************************

// Update User name, email, or password, usable route for all three separate update functions.
// /api/user/put/
router.put("/put/", auth, async (req, res) => {
	try {
		const {
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			confirmationNewPassword,
			existingPassword,
		} = req.body;

		// Checks to make sure at least one field is being updated
		// add a check that at least one designated field is being updated
		if (!newFirstName && !newLastName && !newEmail && !newPassword) {
			return res.status(400).send("No updates provided.");
		}

		// Grabs user ID from auth req.user.data
		const userId = req.user.data._id;

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
		}

		if (newLastName && newLastName !== user.last_name) {
			user.last_name = newLastName;
			changes++;
		}

		if (newEmail && newEmail !== user.email) {
			user.email = newEmail;
			changes++;
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

		res.status(200).json({
			message: `Account for ${updatedUser.first_name} ${updatedUser.last_name} updated!`,
			updatedUser,
		});
	} catch (error) {
		return res.status(400).json(error);
	}
});

// **************************
// *** User Delete Routes ***
// **************************

// Delete User by ID route
// Requires UI to ask user to retype email address to confirm deletion
// /api/user/delete/
router.delete("/delete", auth, async (req, res) => {
	try {
		const { confirmationPassword } = req.body;

		const user = await User.findById(req.user.data._id);

		if (!user) {
			return res.status(404).send({ error: "User not found." });
		}

		const verification = await user.isCorrectPassword(confirmationPassword);

		if (!verification) {
			return res.status(400).send({ error: "Password does not match user record." });
		}

		const deletedUser = await User.findByIdAndDelete(req.user.data._id);
		res.status(200).json({
			message: `Account for ${deletedUser.first_name} ${deletedUser.last_name} deleted!`,
		});
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
