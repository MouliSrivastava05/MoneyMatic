import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "User already exists" });
    }
    if (error.code === 'P1001') {
      console.error("Database connection failed - check Aiven service status");
      return res.status(503).json({ 
        message: "Database connection failed. Please check server logs." 
      });
    }
    console.error("Full error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    res.status(500).json({ 
      message: "Server error",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message 
      })
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === 'P1001') {
      console.error("Database connection failed - check Aiven service status");
      return res.status(503).json({ 
        message: "Database connection failed. Please check server logs." 
      });
    }
    console.error("Full error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    res.status(500).json({ 
      message: "Server error",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message 
      })
    });
  }
});

export default router;

