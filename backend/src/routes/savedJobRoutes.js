const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  saveJob,
  getSavedJobs,
  unsaveJob,
  checkSavedJob,
} = require("../controllers/savedJobController");

// All saved-job routes require login
router.use(authMiddleware);

// GET all saved jobs
router.get("/", getSavedJobs);

// CHECK whether job is saved
router.get("/:jobId/check", checkSavedJob);

// SAVE job
router.post("/:jobId", saveJob);

// UNSAVE job
router.delete("/:jobId", unsaveJob);

module.exports = router;
