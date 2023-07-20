const router = require("express").Router();
const { User } = require("../../models");

// **************************
// *** User GET Routes ***
// **************************

// Get User by ID route
// /api/user/get/:id
router.get("get/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Get all Users route
// /api/user/get/
router.get("/get", async (req, res) => {
	try {
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
		const { name, email, password } = req.body;

		const user = await User.create({ name, email, password });
		res.status(200).json({ message: `Account for ${name} created!`, user });
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

		res.json({ message: "Login successful!" });
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
router.put("/put/:id", async (req, res) => {
	try {
		const { newName, newEmail, newPassword, confirmationNewPassword, existingPassword } =
			req.body;
		let updatedField;

		if (newName) {
			updatedField = { name: newName };
		} else if (newEmail) {
			updatedField = { email: newEmail };
		} else if (newPassword) {
			// if resetting password, asks for existing password and new password typed twice
			if (!existingPassword) {
				return res.status(400).send("Please enter your existing password.");
			}
			const user = await User.findById(req.params.id);
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

			updatedField = { password: newPassword };
		} else {
			res.status(400).send("No field to update.");
		}

		const user = await User.findByIdAndUpdate(req.params.id, updatedField, { new: true });

		if (!user) {
			return res.status(404).send("User not found.");
		}

		res.status(200).json({ message: `Account for ${user.name} updated!`, user });
	} catch (err) {
		res.status(400).json(err);
	}
});

// **************************
// *** User Delete Routes ***
// **************************

// Delete User by ID route
// Requires UI to ask user to retype email address to confirm deletion
// /api/user/delete/:id
router.delete("/delete/:id", async (req, res) => {
	try {
		const { confirmationPassword } = req.body;

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		const verification = await user.isCorrectPassword(confirmationPassword);

		if (!verification) {
			return res.status(400).send("Password does not match user record.");
		}

		const deletedUser = await User.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: `Account for ${deletedUser.name} deleted!` });
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;
