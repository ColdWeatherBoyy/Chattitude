const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const secret = process.env.SECRET;
const expiration = "48hrs";

module.exports = {
	signToken: function ({ _id }) {
		const payload = { _id };
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
	auth: function (req, res, next) {
		const token = req.header("Authorization").replace("Bearer ", "") || "";

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
