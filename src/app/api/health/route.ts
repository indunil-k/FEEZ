import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { successResponse, handleApiError } from '@/lib/api-utils';

export async function GET(_req: NextRequest) {
  try {
    // Test database connection
    await dbConnect();

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
    };

    return successResponse(healthCheck, 'Service is healthy');
  } catch (error) {
    return handleApiError(error);
  }
}
