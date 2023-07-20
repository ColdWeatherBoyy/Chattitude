const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
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

userSchema.methods.isCorrectPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (err) {
		throw new Error(err);
	}
};

const User = model("User", userSchema);

module.exports = User;
