const prisma = require("../config/prisma");

async function applyForJob(userId, jobId) {
  const numericJobId = Number(jobId);

  if (!Number.isInteger(numericJobId) || numericJobId <= 0) {
    const error = new Error("A valid jobId is required");
    error.statusCode = 400;
    throw error;
  }

  const job = await prisma.job.findUnique({
    where: {
      id: numericJobId,
    },
  });

  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent duplicate applications.
  const existingApplication = await prisma.application.findFirst({
    where: {
      userId,
      jobId: numericJobId,
    },
  });

  if (existingApplication) {
    const error = new Error("You have already applied for this job");
    error.statusCode = 409;
    throw error;
  }

  // Create the application.
  const application = await prisma.application.create({
    data: {
      userId,
      jobId: numericJobId,
    },
    include: {
      job: true,
    },
  });

  return application;
}

async function getMyApplications(userId) {
  return prisma.application.findMany({
    where: {
      userId,
    },
    include: {
      job: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
}

async function getApplicationById(userId, applicationId) {
  const numericApplicationId = Number(applicationId);

  if (!Number.isInteger(numericApplicationId) || numericApplicationId <= 0) {
    return null;
  }

  return prisma.application.findFirst({
    where: {
      id: numericApplicationId,
      userId,
    },
    include: {
      job: true,
    },
  });
}

async function updateApplicationStatus(applicationId, status) {
  const numericId = Number(applicationId);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    const error = new Error("A valid application ID is required");
    error.statusCode = 400;
    throw error;
  }

  const allowedStatuses = ["applied", "interview", "selected", "rejected"];

  if (!allowedStatuses.includes(status)) {
    const error = new Error(
      `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.application.findUnique({
    where: { id: numericId },
  });

  if (!existing) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.application.update({
    where: { id: numericId },
    data: { status },
    include: { job: true },
  });
}

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
};
