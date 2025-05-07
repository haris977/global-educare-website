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
import { authMiddleware, checkRole } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", createUser as any);
router.post("/login", loginUser as any);

// Token validation route
router.get("/validate-token", authMiddleware as any, validateToken as any);

// Protected routes
router.get(
  "/",
  authMiddleware as any,
  checkRole(["ADMIN", "SUPER_ADMIN"]) as any,
  getAllUsers as any
);
router.get("/:id", authMiddleware as any, getUserById as any);
router.put("/:id", authMiddleware as any, updateUser as any);
router.delete("/:id", authMiddleware as any, deleteUser as any);

// Subscription related routes
router.post("/trial", authMiddleware as any, startFreeTrial as any);
router.post("/subscribe", authMiddleware as any, subscribeUser as any);
router.post("/refund", authMiddleware as any, requestRefund as any);

export default router;
