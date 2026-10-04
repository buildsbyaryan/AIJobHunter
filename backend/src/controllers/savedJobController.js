const prisma = require("../config/prisma");

// =========================
// SAVE JOB
// =========================

const saveJob = async (req, res) => {
  try {
    const userId = Number(req.user?.userId || req.user?.id);
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "Invalid or missing user authentication",
      });
    }

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    // Check job
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check duplicate
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingSavedJob) {
      return res.status(409).json({
        message: "Job already saved",
        saved: true,
      });
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: true,
      },
    });

    return res.status(201).json({
      message: "Job saved successfully",
      saved: true,
      savedJob,
    });
  } catch (error) {
    console.error("SAVE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to save job",
    });
  }
};

// =========================
// GET SAVED JOBS
// =========================

const getSavedJobs = async (req, res) => {
  try {
    const userId = Number(req.user?.userId || req.user?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "Invalid or missing user authentication",
      });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId,
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Saved jobs fetched successfully",
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    console.error("GET SAVED JOBS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch saved jobs",
    });
  }
};

// =========================
// UNSAVE JOB
// =========================

const unsaveJob = async (req, res) => {
  try {
    const userId = Number(req.user?.userId || req.user?.id);
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "Invalid or missing user authentication",
      });
    }

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
        saved: false,
      });
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return res.status(200).json({
      message: "Job removed from saved jobs",
      saved: false,
    });
  } catch (error) {
    console.error("UNSAVE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to remove saved job",
    });
  }
};

// =========================
// CHECK SAVED JOB
// =========================

const checkSavedJob = async (req, res) => {
  try {
    const userId = Number(req.user?.userId || req.user?.id);
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "Invalid or missing user authentication",
      });
    }

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return res.status(200).json({
      saved: Boolean(savedJob),
    });
  } catch (error) {
    console.error("CHECK SAVED JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to check saved job",
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  unsaveJob,
  checkSavedJob,
};
