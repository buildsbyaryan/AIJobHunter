const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const applicationController = require("../controllers/applicationController");

router.use(authMiddleware);

// Existing endpoints — unchanged
router.post("/", applicationController.apply);
router.get("/", applicationController.getMine);
router.get("/:id", applicationController.getOne);

// New endpoint
router.patch("/:id/status", applicationController.updateStatus);

module.exports = router;
