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
			return res.status(404).send("Authenticated user not found.");
		}

		const user = await User.findById(req.params.id);
		console.log(req.params.id);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		res.json(user);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get all Users route
// /api/user/get/
router.get("/get", auth, async (req, res) => {
	try {
		const authenticatedUser = await User.findById(req.user.data._id);

		if (!authenticatedUser) {
			return res.status(404).send("Authenticated user not found.");
		}

		const users = await User.find({});
		res.json(users);
	} catch (err) {
		res.status(400).json(err);
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
		res.status(400).json(err);
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
			return res.status(400).send("Email not found.");
		}

		const verified = await user.isCorrectPassword(password);

		if (!verified) {
			return res.status(400).send("Password does not match.");
		}

		// add JWT here
		const token = signToken(user);

		res.json({ message: "Login successful!", token, user });
	} catch (err) {
		res.status(400).json(err);
	}
});

// **************************
// *** User Put Routes ***
// **************************

// Update User name, email, or password, usable route for all three separate update functions.
// Would require the update requests to be sent indivdually, not designed for multiple updates at once.
// /api/user/put/:id
router.put("/", auth, async (req, res) => {
	try {
		const {
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			confirmationNewPassword,
			existingPassword,
		} = req.body;
		let updatedField = {};

		const userId = req.user._id;

		if (newFirstName) {
			updatedField.first_name = newFirstName;
		}

		if (newLastName) {
			updatedField.last_name = newLastName;
		}

		if (newEmail) {
			updatedField.email = newEmail;
		}

		if (newPassword) {
			// if resetting password, asks for existing password and new password typed twice
			if (!existingPassword) {
				return res.status(400).send("Please enter your existing password.");
			}

			const user = await User.findById(userId);
			// confirmation that existing password is correct
			const verified = await user.isCorrectPassword(existingPassword);

			if (!verified) {
				return res
					.status(400)
					.send("Your existing password is incorrect. Please try again.");
			}

			// confirmation that new password typed twice matches
			if (newPassword !== confirmationNewPassword) {
				return res.status(400).send("New passwords don't match.");
			}

			updatedField.password = newPassword;
		}

		if (Object.keys(updatedField).length === 0) {
			return res.status(400).send("No updates provided.");
		}

		const updatedUser = await User.findByIdAndUpdate(userId, updatedField, {
			new: true,
		});

		if (!updatedUser) {
			return res.status(404).send("User not found.");
		}

		res
			.status(200)
			.json({ message: `Account for ${updatedUser.first_name} updated!`, updatedUser });
	} catch (err) {
		return res.status(400).json(err);
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
		console.log(user);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		const verification = await user.isCorrectPassword(confirmationPassword);

		if (!verification) {
			return res.status(400).send("Password does not match user record.");
		}

		const deletedUser = await User.findByIdAndDelete(req.user.data._id);
		res.status(200).json({
			message: `Account for ${deletedUser.first_name} ${deletedUser.last_name} deleted!`,
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
