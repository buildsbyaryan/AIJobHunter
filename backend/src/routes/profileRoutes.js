const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const router = express.Router();

// GET /api/profile
router.get("/", authMiddleware, getProfile);

// PUT /api/profile
router.put("/", authMiddleware, updateProfile);

module.exports = router;
