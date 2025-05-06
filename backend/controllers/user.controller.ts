import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, age, gender, state, phone, dob, coldHousing, aadhar, pan, address } = req.body;

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
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return sendSuccessResponse(res, userWithoutPassword, 'User created successfully', 201);
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

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        state: true,
        phone: true,
        role: true,
        dob: true,
        coldHousing: true,
        aadhar: true,
        pan: true,
        address: true,
        relatedCandidates: true
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
        age: true,
        gender: true,
        state: true,
        phone: true,
        role: true,
        dob: true,
        coldHousing: true,
        aadhar: true,
        pan: true,
        address: true,
        relatedCandidates: true
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
    const { name, email, age, gender, state, phone, role, dob, coldHousing, aadhar, pan, address } = req.body;

    // Only allow users to update their own data or admin users
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        age,
        gender,
        state,
        phone,
        role,
        dob: dob ? new Date(dob) : undefined,
        coldHousing,
        aadhar,
        pan,
        address
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
    if (req.user?.id !== id && req.user?.role !== 'admin') {
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