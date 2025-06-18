import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  requestRefund,
  startFreeTrial,
  subscribeUser,
  updateUser,
  validateToken,
} from "../controllers/user.controller";
import { authenticateToken, checkRole } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", createUser as any);
router.post("/login", loginUser as any);

// Token validation route
router.get("/validate-token", authenticateToken as any, validateToken as any);

// Protected routes
router.get(
  "/",
  authenticateToken as any,
  checkRole(["ADMIN", "SUPER_ADMIN"]) as any,
  getAllUsers as any
);
router.get("/:id", authenticateToken as any, getUserById as any);
router.put("/:id", authenticateToken as any, updateUser as any);
router.delete("/:id", authenticateToken as any, deleteUser as any);

// Subscription related routes
router.post("/trial", authenticateToken as any, startFreeTrial as any);
router.post("/subscribe", authenticateToken as any, subscribeUser as any);
router.post("/refund", authenticateToken as any, requestRefund as any);

export default router;
