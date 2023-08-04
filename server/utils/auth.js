const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const secret = process.env.SECRET;
const expiration = "48h";

module.exports = {
	signToken: function ({ _id, first_name }) {
		console.log(_id, first_name);
		return jwt.sign({ id: _id, first_name }, secret, {
			expiresIn: expiration,
		});
	},
	auth: function (req, res, next) {
		const tokenCookie = req.headers.cookie
			? req.headers.cookie
					.split(";")
					.find((cookie) => cookie.trim().startsWith("chattitude-token="))
			: null;
		console.log(tokenCookie);
		if (!tokenCookie) {
			return res.status(401).json({ message: "No token, authorization denied" });
		}
		try {
			const token = tokenCookie.split("=")[1];
			console.log(token);
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
