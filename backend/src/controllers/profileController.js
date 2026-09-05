const prisma = require("../config/prisma");

// =========================
// GET PROFILE
// =========================

const getProfile = async (req, res) => {
  try {
    const userId = Number(req.user.userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res) => {
  try {
    const userId = Number(req.user.userId);

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        message: "Name or email is required",
      });
    }

    // Check if another user already has this email
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already being used by another user",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
