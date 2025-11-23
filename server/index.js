import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma/client.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import budgetRoutes from "./routes/budget.js";
import reminderRoutes from "./routes/reminders.js";

dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error(" ERROR: JWT_SECRET is required in production!");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not set. Using default (unsafe for production)");
}

const app = express();

app.use(express.json());
app.use(cors());

prisma.$connect()
  .then(() => {
    console.log("Prisma Client initialized and ready!");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    console.error("Please check your DATABASE_URL in .env file");
  });

app.get("/", (req, res) => {
  res.send("Welcome to MoneyMatic Server");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/reminders", reminderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
