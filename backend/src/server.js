const express = require("express");

const app = express();

const PORT = 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

// ===============================
// TEMPORARY DATA
// ===============================

let users = [
  {
    id: "1",
    name: "Aryan",
    email: "aryan@gmail.com",
  },
];

let jobs = [
  {
    id: "1",
    title: "Flutter Developer",
    company: "Google",
    location: "Bangalore",
    type: "Full Time",
  },
  {
    id: "2",
    title: "React Native Developer",
    company: "Microsoft",
    location: "Hyderabad",
    type: "Full Time",
  },
];

let applications = [];

// ===============================
// TEST ROUTE
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    message: "AIJobHunter API is working!",
  });
});

// =====================================================
// USERS API
// =====================================================

// GET ALL USERS

app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: users,
  });
});

// GET SINGLE USER

app.get("/api/users/:id", (req, res) => {
  const user = users.find(
    (user) => user.id === req.params.id
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

// CREATE USER

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

// UPDATE USER - PUT

app.put("/api/users/:id", (req, res) => {
  const { name, email } = req.body;

  const userIndex = users.findIndex(
    (user) => user.id === req.params.id
  );

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  users[userIndex] = {
    id: users[userIndex].id,
    name,
    email,
  };

  res.json({
    success: true,
    message: "User updated successfully",
    data: users[userIndex],
  });
});

// UPDATE USER - PATCH

app.patch("/api/users/:id", (req, res) => {
  const user = users.find(
    (user) => user.id === req.params.id
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  if (req.body.email !== undefined) {
    user.email = req.body.email;
  }

  res.json({
    success: true,
    message: "User partially updated",
    data: user,
  });
});

// DELETE USER

app.delete("/api/users/:id", (req, res) => {
  const userIndex = users.findIndex(
    (user) => user.id === req.params.id
  );

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const deletedUser = users[userIndex];

  users.splice(userIndex, 1);

  res.json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

// =====================================================
// JOBS API
// =====================================================

// GET ALL JOBS

app.get("/api/jobs", (req, res) => {
  res.json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// GET SINGLE JOB

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.find(
    (job) => job.id === req.params.id
  );

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  res.json({
    success: true,
    data: job,
  });
});

// CREATE JOB

app.post("/api/jobs", (req, res) => {
  const {
    title,
    company,
    location,
    type,
  } = req.body;

  if (
    !title ||
    !company ||
    !location ||
    !type
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title, company, location and type are required",
    });
  }

  const newJob = {
    id: Date.now().toString(),
    title,
    company,
    location,
    type,
  };

  jobs.push(newJob);

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    data: newJob,
  });
});

// UPDATE JOB

app.put("/api/jobs/:id", (req, res) => {
  const jobIndex = jobs.findIndex(
    (job) => job.id === req.params.id
  );

  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  const {
    title,
    company,
    location,
    type,
  } = req.body;

  if (
    !title ||
    !company ||
    !location ||
    !type
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title, company, location and type are required",
    });
  }

  jobs[jobIndex] = {
    id: jobs[jobIndex].id,
    title,
    company,
    location,
    type,
  };

  res.json({
    success: true,
    message: "Job updated successfully",
    data: jobs[jobIndex],
  });
});

// PATCH JOB

app.patch("/api/jobs/:id", (req, res) => {
  const job = jobs.find(
    (job) => job.id === req.params.id
  );

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  if (req.body.title !== undefined) {
    job.title = req.body.title;
  }

  if (req.body.company !== undefined) {
    job.company = req.body.company;
  }

  if (req.body.location !== undefined) {
    job.location = req.body.location;
  }

  if (req.body.type !== undefined) {
    job.type = req.body.type;
  }

  res.json({
    success: true,
    message: "Job partially updated",
    data: job,
  });
});

// DELETE JOB

app.delete("/api/jobs/:id", (req, res) => {
  const jobIndex = jobs.findIndex(
    (job) => job.id === req.params.id
  );

  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  const deletedJob = jobs[jobIndex];

  jobs.splice(jobIndex, 1);

  res.json({
    success: true,
    message: "Job deleted successfully",
    data: deletedJob,
  });
});

// =====================================================
// APPLICATIONS API
// =====================================================

// GET ALL APPLICATIONS

app.get("/api/applications", (req, res) => {
  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// GET SINGLE APPLICATION

app.get(
  "/api/applications/:id",
  (req, res) => {
    const application =
      applications.find(
        (application) =>
          application.id === req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  }
);

// CREATE APPLICATION

app.post(
  "/api/applications",
  (req, res) => {
    const {
      userId,
      jobId,
      status,
    } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message:
          "userId and jobId are required",
      });
    }

    const newApplication = {
      id: Date.now().toString(),
      userId,
      jobId,
      status: status || "applied",
    };

    applications.push(newApplication);

    res.status(201).json({
      success: true,
      message:
        "Application created successfully",
      data: newApplication,
    });
  }
);

// UPDATE APPLICATION

app.patch(
  "/api/applications/:id",
  (req, res) => {
    const application =
      applications.find(
        (application) =>
          application.id === req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (req.body.status !== undefined) {
      application.status = req.body.status;
    }

    res.json({
      success: true,
      message:
        "Application updated successfully",
      data: application,
    });
  }
);

// DELETE APPLICATION

app.delete(
  "/api/applications/:id",
  (req, res) => {
    const applicationIndex =
      applications.findIndex(
        (application) =>
          application.id === req.params.id
      );

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const deletedApplication =
      applications[applicationIndex];

    applications.splice(
      applicationIndex,
      1
    );

    res.json({
      success: true,
      message:
        "Application deleted successfully",
      data: deletedApplication,
    });
  }
);

// =====================================================
// SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `AIJobHunter backend running on http://localhost:${PORT}`
  );
});