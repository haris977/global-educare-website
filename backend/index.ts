import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import os from "os";

// routes
import { userRoutes, testRoutes } from "./routes";

dotenv.config();

const app = express();

// Allow all origins for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Session-ID"],
  exposedHeaders: ["X-Session-ID"], // Expose the session ID header
  credentials: true
}));

// Parse JSON requests
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const port = process.env.PORT || 8000;

// Function to get the local network IP address
const getLocalIpAddress = (): string | null => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    if (addresses) {
      for (const address of addresses) {
        if (address.family === "IPv4" && !address.internal) {
          return address.address;
        }
      }
    }
  }
  return null;
};

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    message: "Server is up and running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);

// Base route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Global Educare API" });
});

// Start the server
app.listen(port, () => {
  const ipAddress = getLocalIpAddress();
  console.log(`Server is running on port ${port}`);
  if (ipAddress) {
    console.log(`Server is accessible at http://${ipAddress}:${port}`);
  }
});
