// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./prisma/client.js";

// Load environment variables from .env
dotenv.config();

// Validate JWT_SECRET
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error(" ERROR: JWT_SECRET is required in production!");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not set. Using default (unsafe for production)");
}

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test database connection (Prisma connects automatically on first query)
// This is a test to verify connection works
prisma.$connect()
  .then(() => {
    console.log("Prisma Client initialized and ready!");
    prisma.$disconnect(); // Disconnect test connection, Prisma will reconnect on first query
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    console.error("Please check your DATABASE_URL in .env file");
  });

// Example route
app.get("/", (req, res) => {
  res.send("Welcome to MoneyMatic Server");
});

// Authentication Routes

// Signup Route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
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
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
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
    // Handle database connection errors
    if (error.code === 'P1001') {
      console.error("Database connection failed - check Aiven service status");
      return res.status(503).json({ 
        message: "Database connection failed. Please check server logs." 
      });
    }
    // More detailed error logging
    console.error("Full error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    res.status(500).json({ 
      message: "Server error",
      // Only include error details in development
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message 
      })
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));