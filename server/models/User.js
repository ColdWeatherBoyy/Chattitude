// Required dependencies from Mongoose and bcrypt
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Create a new Schema for the User model
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		// validates email using a regex (frontend also handles this)
		match: [/.+@.+\..+/, "Must match an email address!"],
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		// validates password using a regex
		validate: {
			validator: function (value) {
				// tests password for having one digit, one lowercase, one uppercase, one special character, and to be at least 8 characters long
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
					value
				);
			},
			message: (props) => "Not a valid password!",
		},
	},
	timezone: {
		type: String,
		required: true,
		default: "UTC-5",
	},
});

// Pre-save hook to hash password and lowercase email before saving new user
userSchema.pre("save", async function (next) {
	this.email = this.email.toLowerCase();
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10;
		try {
			this.password = await bcrypt.hash(this.password, saltRounds);
		} catch (err) {
			console.log(err);
		}
	}
	next();
});

// Pre-update hook to hash password and lowercase email before saving modified user
userSchema.pre("findOneAndUpdate", async function (next) {
	const update = this.getUpdate();
	if (update.email) {
		update.email = update.email.toLowerCase();
	}

	if (update.password) {
		const saltRounds = 10;
		try {
			const hashedPassword = await bcrypt.hash(update.password, saltRounds);
			this.setUpdate({ ...update, password: hashedPassword });
		} catch (err) {
			console.log(err);
		}
	}
	next();
});

// Method to compare password to hashed password
userSchema.methods.isCorrectPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (err) {
		throw new Error(err);
	}
};

// Create the User model using the userSchema
const User = model("User", userSchema);

module.exports = User;
