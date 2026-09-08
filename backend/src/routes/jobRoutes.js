const express = require("express");

const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

// GET /api/jobs
router.get("/", getAllJobs);

// GET /api/jobs/:id
router.get("/:id", getJobById);

// POST /api/jobs
router.post("/", createJob);

// PUT /api/jobs/:id
router.put("/:id", updateJob);

// DELETE /api/jobs/:id
router.delete("/:id", deleteJob);

module.exports = router;
