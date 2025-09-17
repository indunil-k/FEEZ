import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userName, user, password } = body;

    // Validation
    if (!userName || !user || !password) {
      return errorResponse('User name, username/email, and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ user });
    if (existingUser) {
      return errorResponse('User with this username/email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      userName,
      user,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      userName: newUser.userName,
      user: newUser.user,
      createdAt: newUser.createdAt,
    };

    return successResponse(userResponse, 'User created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({}).select('-password');
    return successResponse(users, 'Users fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
