import express from "express";
import prisma from "../prisma/client.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get all transactions with search, filter, sort, pagination
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      page = "1",
      limit = "10",
      search = "",
      category = "",
      type = "",
      sortBy = "date",
      sortOrder = "desc",
      startDate = "",
      endDate = "",
      minAmount = "",
      maxAmount = "",
    } = req.query;

    const where = {
      userId,
    };

    if (search) {
      where.OR = [
        {
          description: {
            contains: search,
          },
        },
        {
          category: {
            contains: search,
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (type && (type === "income" || type === "expense")) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) {
        where.amount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        where.amount.lte = parseFloat(maxAmount);
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orderBy = {};
    if (sortBy === "date") {
      orderBy.date = sortOrder === "asc" ? "asc" : "desc";
    } else if (sortBy === "amount") {
      orderBy.amount = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      message: "Error fetching transactions",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Create new transaction
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({
        message: "Please provide type, amount, category, and date",
      });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        message: "Type must be 'income' or 'expense'",
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount: parseFloat(amount),
        category,
        description: description || null,
        date: new Date(date),
      },
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({
      message: "Error creating transaction",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Update transaction
router.put("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const transactionId = parseInt(req.params.id);
    const { type, amount, category, description, date } = req.body;

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updateData = {};
    if (type !== undefined) {
      if (type !== "income" && type !== "expense") {
        return res.status(400).json({
          message: "Type must be 'income' or 'expense'",
        });
      }
      updateData.type = type;
    }
    if (amount !== undefined) {
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          message: "Amount must be a positive number",
        });
      }
      updateData.amount = parseFloat(amount);
    }
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
    });

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({
      message: "Error updating transaction",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

// Delete transaction
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const transactionId = parseInt(req.params.id);

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({
      message: "Error deleting transaction",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
});

export default router;

