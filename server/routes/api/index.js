const router = require("express").Router();
const userRoutes = require("./UserRoutes");

// /api/user routes
router.use("/user", userRoutes);

module.exports = router;
