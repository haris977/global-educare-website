import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Define possible subscription and role types
type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'STUDY_MATERIAL_ADMIN' | 'DOUBTS_SOLVING_ADMIN' | 'KEY_ACCOUNT_ADMIN' | 'TECHNICAL_ADMIN';
type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'EXPIRED';
type SubscriptionPlan = 'BASIC' | 'STANDARD' | 'PREMIUM';
type RefundStatus = 'NONE' | 'REQUESTED' | 'PROCESSING' | 'APPROVED' | 'REJECTED';

const prisma = new PrismaClient();

// Register a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, profilePicture } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendErrorResponse(res, 'User with this email already exists', 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        profilePicture,
        role: 'USER' as Role,
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return sendSuccessResponse(res, userWithoutPassword, 'User registered successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, 'Error creating user', 500, error);
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendErrorResponse(res, 'Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 'Invalid credentials', 401);
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return sendSuccessResponse(
      res,
      { user: userWithoutPassword, token },
      'Login successful'
    );
  } catch (error) {
    return sendErrorResponse(res, 'Error during login', 500, error);
  }
};

// Start free trial
export const startFreeTrial = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    const userId = req.user.id;
    
    // Check if user already used trial
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    if (user.freeTrialUsed) {
      return sendErrorResponse(res, 'Free trial already used', 400);
    }

    // Set trial period (3 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    // Update user with trial information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'TRIAL' as SubscriptionStatus,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
        freeTrialUsed: true
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return sendSuccessResponse(res, userWithoutPassword, 'Free trial started successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error starting free trial', 500, error);
  }
};

// Subscribe user
export const subscribeUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    const userId = req.user.id;
    const { subscriptionPlan } = req.body;

    if (!subscriptionPlan || !['BASIC', 'STANDARD', 'PREMIUM'].includes(subscriptionPlan)) {
      return sendErrorResponse(res, 'Invalid subscription plan', 400);
    }

    // Set subscription period (e.g., 30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30-day subscription

    // Update user with subscription information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE' as SubscriptionStatus,
        subscriptionPlan: subscriptionPlan as SubscriptionPlan,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return sendSuccessResponse(res, userWithoutPassword, 'Subscription successful');
  } catch (error) {
    return sendErrorResponse(res, 'Error processing subscription', 500, error);
  }
};

// Request refund
export const requestRefund = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    const userId = req.user.id;
    
    // Check if user is eligible for refund (within 7 days of subscription)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    if (user.subscriptionStatus !== 'ACTIVE') {
      return sendErrorResponse(res, 'No active subscription found', 400);
    }

    if (user.refundRequested) {
      return sendErrorResponse(res, 'Refund already requested', 400);
    }

    // Check if within 7 days of subscription
    if (!user.subscriptionStartDate) {
      return sendErrorResponse(res, 'Subscription start date not found', 400);
    }

    const subscriptionDate = new Date(user.subscriptionStartDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - subscriptionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return sendErrorResponse(res, 'Refund only available within 7 days of subscription', 400);
    }

    // Update user with refund request
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        refundRequested: true,
        refundStatus: 'REQUESTED' as RefundStatus,
        refundRequestDate: new Date()
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return sendSuccessResponse(res, userWithoutPassword, 'Refund requested successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error requesting refund', 500, error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        freeTrialUsed: true,
        refundRequested: true,
        refundStatus: true,
        lastLoginAt: true
      }
    });

    return sendSuccessResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving users', 500, error);
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        freeTrialUsed: true,
        refundRequested: true,
        refundStatus: true,
        lastLoginAt: true,
        progressData: true
      }
    });

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    return sendSuccessResponse(res, user, 'User retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving user', 500, error);
  }
};

// Update user
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, profilePicture } = req.body;

    // Only allow users to update their own data or admin users
    if (req.user?.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        profilePicture
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return sendSuccessResponse(res, userWithoutPassword, 'User updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating user', 500, error);
  }
};

// Delete user
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow users to delete their own data or admin users
    if (req.user?.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    await prisma.user.delete({
      where: { id }
    });

    return sendSuccessResponse(res, null, 'User deleted successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error deleting user', 500, error);
  }
}; 