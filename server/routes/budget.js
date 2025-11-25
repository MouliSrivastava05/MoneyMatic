import express from "express";
import prisma from "../prisma/client.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get budget analytics
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        year: targetYear,
        month: targetMonth,
        period: "monthly",
      },
    });

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = totalIncome - totalExpenses;

    const spendingByCategory = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        spendingByCategory[t.category] =
          (spendingByCategory[t.category] || 0) + Number(t.amount);
      });

    const budgetAnalysis = budgets.map((budget) => {
      const actualSpending = spendingByCategory[budget.category] || 0;
      const remaining = Number(budget.limit) - actualSpending;
      const percentageUsed = (actualSpending / Number(budget.limit)) * 100;

      return {
        ...budget,
        actualSpending,
        remaining,
        percentageUsed: Math.round(percentageUsed * 100) / 100,
        isOverBudget: actualSpending > Number(budget.limit),
      };
    });

    res.json({
      period: {
        month: targetMonth,
        year: targetYear,
      },
      summary: {
        totalIncome,
        totalExpenses,
        savings,
      },
      budgets: budgetAnalysis,
      spendingByCategory,
    });
  } catch (error) {
    console.error("Get budget analytics error:", error);
    res.status(500).json({
      message: "Error fetching budget analytics",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Create new budget
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      category,
      limit,
      period = "monthly",
      month,
      year,
    } = req.body;

    if (!category || !limit || !month || !year) {
      return res.status(400).json({
        message: "Please provide category, limit, month, and year",
      });
    }

    const numericLimit = parseFloat(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      return res.status(400).json({
        message: "Limit must be a positive number",
      });
    }

    const newBudget = await prisma.budget.create({
      data: {
        userId,
        category,
        limit: numericLimit,
        period,
        month: parseInt(month),
        year: parseInt(year),
      },
    });

    res.status(201).json({
      message: "Budget created successfully",
      budget: newBudget,
    });
  } catch (error) {
    console.error("Create budget error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        message:
          "A budget for this category already exists for the selected period",
      });
    }
    res.status(500).json({
      message: "Error creating budget",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Update budget
router.put("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const budgetId = parseInt(req.params.id);
    const { category, limit, period, month, year } = req.body;

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });

    if (!existingBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (limit !== undefined) {
      const numericLimit = parseFloat(limit);
      if (isNaN(numericLimit) || numericLimit <= 0) {
        return res.status(400).json({
          message: "Limit must be a positive number",
        });
      }
      updateData.limit = numericLimit;
    }
    if (period !== undefined) updateData.period = period;
    if (month !== undefined) updateData.month = parseInt(month);
    if (year !== undefined) updateData.year = parseInt(year);

    const updatedBudget = await prisma.budget.update({
      where: { id: budgetId },
      data: updateData,
    });

    res.json({
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    console.error("Update budget error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        message:
          "A budget for this category already exists for the selected period",
      });
    }
    res.status(500).json({
      message: "Error updating budget",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Delete budget
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const budgetId = parseInt(req.params.id);

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });

    if (!existingBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await prisma.budget.delete({
      where: { id: budgetId },
    });

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({
      message: "Error deleting budget",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

export default router;

