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

    const numericJobId = Number(jobId);

    if (
      jobId === undefined ||
      jobId === null ||
      jobId === "" ||
      !Number.isInteger(numericJobId) ||
      numericJobId <= 0
    ) {
      return res.status(400).json({
        message: "A valid jobId is required",
      });
    }

    const application = await applicationService.applyForJob(
      userId,
      numericJobId,
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("APPLY ERROR:", error);

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

    const applications = await applicationService.getMyApplications(userId);

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return res.status(error.statusCode || 500).json({
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

    const application = await applicationService.getApplicationById(
      userId,
      req.params.id,
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
    console.error("GET APPLICATION ERROR:", error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch application",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only an authorized admin can update application status",
      });
    }

    const { status } = req.body;

    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      status,
    );

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to update application status",
    });
  }
};

module.exports = {
  apply,
  getMine,
  getOne,
  updateStatus,
};
