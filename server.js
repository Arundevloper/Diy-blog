import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import cors from "cors";
import morgan from "morgan";
import experimentRoutes from "./routes/experimentRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
dotenv.config();

// Get current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database and start server
connectDB();

// Create Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Serve React app
app.use(express.static(path.join(__dirname, "./client/build")));

// API routes
app.use("/api/v1/experiment", experimentRoutes);

// All other routes (non-API routes) go to React app
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
