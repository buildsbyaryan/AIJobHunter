const prisma = require("../config/prisma");

// =========================
// SAVE JOB
// =========================

const saveJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = Number(req.params.jobId);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    // Check whether job exists
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

    // Check duplicate save
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

    res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    console.error("SAVE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to save job",
    });
  }
};

// =========================
// GET SAVED JOBS
// =========================

const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

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

    const jobs = savedJobs.map((item) => item.job);

    res.status(200).json({
      message: "Saved jobs fetched successfully",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET SAVED JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch saved jobs",
    });
  }
};

// =========================
// UNSAVE JOB
// =========================

const unsaveJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = Number(req.params.jobId);

    if (Number.isNaN(jobId)) {
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

    res.status(200).json({
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error("UNSAVE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to remove saved job",
    });
  }
};

// =========================
// CHECK WHETHER JOB IS SAVED
// =========================

const checkSavedJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = Number(req.params.jobId);

    if (Number.isNaN(jobId)) {
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

    res.status(200).json({
      saved: Boolean(savedJob),
    });
  } catch (error) {
    console.error("CHECK SAVED JOB ERROR:", error);

    res.status(500).json({
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
