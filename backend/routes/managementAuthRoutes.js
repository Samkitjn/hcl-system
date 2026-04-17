const express = require("express");
const router = express.Router();
const { loginManagement } = require("../controllers/managementAuthController");

router.post("/login", loginManagement);

module.exports = router;