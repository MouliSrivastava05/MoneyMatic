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

export default router;

