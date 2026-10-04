
const prisma = require("../config/prisma");

async function applyForJob(userId, jobId) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.application.findFirst({
    where: { userId, jobId },
  });

  if (existing) {
    const error = new Error("You have already applied for this job");
    error.statusCode = 409;
    throw error;
  }

  return prisma.application.create({
    data: {
      userId,
      jobId,
      status: "applied",
    },
    include: {
      job: true,
    },
  });
}

async function getMyApplications(userId) {
  return prisma.application.findMany({
    where: { userId },
    include: {
      job: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
}

async function getApplicationById(userId, applicationId) {
  return prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
    include: {
      job: true,
    },
  });
}

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationById,
};
