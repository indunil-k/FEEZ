import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entries from '@/models/Entries';
import { successResponse, handleApiError } from '@/lib/api-utils';
import { getUserIdFromToken } from '../../../lib/auth-utils';

// GET /api/groups - List all groups for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userID = await getUserIdFromToken(req);
    if (!userID) return successResponse([], 'Not authenticated');
    // Use projection to fetch only group names
    const doc = await Entries.findOne({ userID }, { 'groups.name': 1, _id: 0 });
    if (!doc || !doc.groups) return successResponse([], 'No groups found');
    const groups = doc.groups.map((g: { name: string }) => g.name);
    return successResponse(groups, 'Groups fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/groups - Create a new group for the user
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userID = await getUserIdFromToken(req);
    if (!userID) return successResponse(null, 'Not authenticated');
    const { groupName } = await req.json();
    if (!groupName) return successResponse(null, 'Group name required');
    let doc = await Entries.findOne({ userID });
    if (!doc) {
      doc = new Entries({ userID, groups: [] });
    }
    await doc.addGroup(groupName);
    return successResponse({ groupName }, 'Group created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
