const router = require("express").Router();
const userRoutes = require("./UserRoutes");
const messageRoutes = require("./MessageRoutes");

// /api/user routes
router.use("/user", userRoutes);

// /api/message routes
router.use("/message", messageRoutes);

module.exports = router;
