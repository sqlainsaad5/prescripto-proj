const express = require("express");
const router = express.Router();

const { signupUser } = require("../controllers/authController");

// Signup Route
router.post("/signup", signupUser);

module.exports = router;