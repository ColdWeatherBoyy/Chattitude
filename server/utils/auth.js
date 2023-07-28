const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const secret = process.env.SECRET;
const expiration = "48h";

module.exports = {
	signToken: function ({ _id, first_name, password }) {
		console.log(_id, first_name, password);
		return jwt.sign({ id: _id, first_name, password }, secret, {
			expiresIn: expiration,
		});
	},
	auth: function (req, res, next) {
		const token = req.headers.cookie.split("=")[1] || "";
		if (!token) {
			return res.status(401).json({ message: "No token, authorization denied" });
		}
		try {
			const verified = jwt.verify(token, secret, { maxAge: expiration });
			req.user = verified;
			next();
		} catch (err) {
			res.status(400).json({ message: "Token is not valid" });
		}
	},
};
