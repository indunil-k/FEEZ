import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { user, password } = await req.json();
    if (!user || !password) {
      return errorResponse('Username/email and password are required', 400);
    }

    // Find user by username/email
    const foundUser = await User.findOne({ user }).select('+password');
    if (!foundUser) {
      return errorResponse('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    // Create JWT token
    const token = jwt.sign({ userID: foundUser._id, user: foundUser.user }, JWT_SECRET, { expiresIn: '7d' });

    // Return user info and token
    return successResponse({
      token,
      user: {
        userID: foundUser._id,
        userName: foundUser.userName,
        user: foundUser.user,
      }
    }, 'Login successful');
  } catch (error) {
    return handleApiError(error);
  }
}
