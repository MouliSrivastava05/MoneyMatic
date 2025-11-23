import express from "express";
import prisma from "../prisma/client.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Create or update reminder
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { id, title, amount, dueDate, frequency, isActive, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Please provide title and dueDate",
      });
    }

    const validFrequencies = ["one-time", "weekly", "monthly", "yearly"];
    if (frequency && !validFrequencies.includes(frequency)) {
      return res.status(400).json({
        message: `Frequency must be one of: ${validFrequencies.join(", ")}`,
      });
    }

    let reminder;

    if (id) {
      const existingReminder = await prisma.reminder.findFirst({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (!existingReminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }

      reminder = await prisma.reminder.update({
        where: { id: parseInt(id) },
        data: {
          title,
          amount: amount ? parseFloat(amount) : null,
          dueDate: new Date(dueDate),
          frequency: frequency || "one-time",
          isActive: isActive !== undefined ? isActive : true,
          notes: notes || null,
        },
      });
    } else {
      reminder = await prisma.reminder.create({
        data: {
          userId,
          title,
          amount: amount ? parseFloat(amount) : null,
          dueDate: new Date(dueDate),
          frequency: frequency || "one-time",
          isActive: isActive !== undefined ? isActive : true,
          notes: notes || null,
        },
      });
    }

    res.status(id ? 200 : 201).json({
      message: id ? "Reminder updated successfully" : "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Create/update reminder error:", error);
    res.status(500).json({
      message: "Error creating/updating reminder",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Get all reminders
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { isActive } = req.query;

    const where = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: {
        dueDate: "asc",
      },
    });

    res.json({ reminders });
  } catch (error) {
    console.error("Get reminders error:", error);
    res.status(500).json({
      message: "Error fetching reminders",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

export default router;

