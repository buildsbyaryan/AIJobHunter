const express = require("express");
const prisma = require("./config/prisma");

const app = express();

const PORT = 5000;

app.use(express.json());

// TEST API
app.get("/api/test", (req, res) => {
  res.json({
    message: "AIJobHunter API is working!",
  });
});

// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// CREATE USER
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

// GET ALL JOBS
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();

    res.json(jobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
});

// CREATE JOB
app.post("/api/jobs", async (req, res) => {
  try {
    const { title, company, location, type, description, salary } = req.body;

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

    res.status(201).json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
});

// GET ALL APPLICATIONS
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
        job: true,
      },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// CREATE APPLICATION
app.post("/api/applications", async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        message: "userId and jobId are required",
      });
    }

    const application = await prisma.application.create({
      data: {
        userId: Number(userId),
        jobId: Number(jobId),
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create application",
    });
  }
});

// GET SAVED JOBS
app.get("/api/saved-jobs", async (req, res) => {
  try {
    const savedJobs = await prisma.savedJob.findMany({
      include: {
        job: true,
      },
    });

    res.json(savedJobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch saved jobs",
    });
  }
});

// SAVE JOB
app.post("/api/saved-jobs", async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        message: "userId and jobId are required",
      });
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: Number(userId),
        jobId: Number(jobId),
      },
    });

    res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save job",
    });
  }
});

app.listen(PORT, () => {
  console.log(`AIJobHunter backend running on http://localhost:${PORT}`);
});
