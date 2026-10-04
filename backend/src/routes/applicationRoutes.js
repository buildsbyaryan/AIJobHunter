const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const applicationController = require("../controllers/applicationController");

router.use(authMiddleware);

router.post("/", applicationController.apply);
router.get("/", applicationController.getMine);
router.get("/:id", applicationController.getOne);

module.exports = router;
