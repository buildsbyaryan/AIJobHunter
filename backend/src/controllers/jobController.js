const prisma = require("../config/prisma");

// =========================
// GET ALL JOBS
// =========================

const getAllJobs = (req, res) => {
  try {
    const jobs = prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Jobs Fetched Successfully",
      jobs,
    });
  } catch (error) {
    console.error("GET ALL JOBS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};

// =========================
// GET SINGLE JOB
// =========================

const getJobById = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

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

    res.status(200).json({
      message: "Job fetched successfully",
      job,
    });
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};


// =========================
// CREATE JOB
// =========================

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      description,
      salary,
    } = req.body;

    if (!title || !company || !location || !type) {
      return res.status(400).json({
        message: "Title, company, location and type are required",
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        description,
        salary,
      },
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
};


// =========================
// UPDATE JOB
// =========================

const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const {
      title,
      company,
      location,
      type,
      description,
      salary,
    } = req.body;

    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(company !== undefined && { company }),
        ...(location !== undefined && { location }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(salary !== undefined && { salary }),
      },
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
};


// =========================
// DELETE JOB
// =========================

const deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to delete job",
    });
  }
};


module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
