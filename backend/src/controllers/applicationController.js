
const applicationService = require("../services/applicationService");

const apply = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!jobId || typeof jobId !== "string") {
      return res.status(400).json({
        message: "A valid jobId is required",
      });
    }

    const application = await applicationService.applyForJob(
      userId,
      jobId
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to submit application",
    });
  }
};

const getMine = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const applications =
      await applicationService.getMyApplications(userId);

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
      count: applications.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch applications",
    });
  }
};

const getOne = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const application =
      await applicationService.getApplicationById(
        userId,
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json({
      message: "Application fetched successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch application",
    });
  }
};

module.exports = {
  apply,
  getMine,
  getOne,
};

