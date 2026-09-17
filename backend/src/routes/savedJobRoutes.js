const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  saveJob,
  getSavedJobs,
  unsaveJob,
  checkSavedJob,
} = require("../controllers/savedJobController");

const router = express.Router();

// Save a job
router.post("/:jobId", protect, saveJob);

// Get logged-in user's saved jobs
router.get("/", protect, getSavedJobs);

// Check whether a job is saved
router.get("/:jobId/check", protect, checkSavedJob);

// Remove a saved job
router.delete("/:jobId", protect, unsaveJob);

module.exports = router;
