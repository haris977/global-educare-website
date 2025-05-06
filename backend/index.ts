import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import os from "os";

// routes
import { userRoutes } from "./routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// Parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// API routes
app.use("/api/users", userRoutes);

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
