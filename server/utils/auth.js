// Import necessary dependencies for JWT and .env
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const secret = process.env.SECRET;
const expiration = "48h";

module.exports = {
	// Function for signing a token and returning it
	signToken: function ({ _id, first_name }) {
		return jwt.sign({ id: _id, first_name }, secret, {
			expiresIn: expiration,
		});
	},
	// Function for verifying a token and returning the payload
	auth: function (req, res, next) {
		const tokenCookie = req.headers.cookie
			? req.headers.cookie
					.split(";")
					.find((cookie) => cookie.trim().startsWith("chattitude-token="))
			: null;
		if (!tokenCookie) {
			return res.status(401).json({ message: "No token, authorization denied" });
		}
		try {
			const token = tokenCookie.split("=")[1];
			// Verify token
			const verified = jwt.verify(token, secret, {
				maxAge: expiration,
			});
			req.user = verified;
			next();
		} catch (err) {
			res.status(400).json({ message: "Token is not valid" });
		}
	},
};
