import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/mongodb';
import Entries from '../../../../../../models/Entries';
import { getUserIdFromToken } from '../../../../../../lib/auth-utils';

// PATCH /api/groups/[groupName]/entries/payment
export async function PATCH(req: NextRequest, context: { params: Promise<{ groupName: string }> }) {
  await dbConnect();
  const userID = getUserIdFromToken(req);
  if (!userID) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { groupName } = await context.params;
  const decodedGroupName = decodeURIComponent(groupName);
  const { entryName, month, status } = await req.json();
  if (!entryName || typeof month !== 'number' || typeof status !== 'boolean') {
    return NextResponse.json({ success: false, error: 'Missing or invalid parameters' }, { status: 400 });
  }
  try {
    const doc = await Entries.findOne({ userID });
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Group not found' }, { status: 404 });
    }
    await doc.updatePaymentStatus(decodedGroupName, entryName, month, status);
    return NextResponse.json({ success: true, message: 'Payment status updated' });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update payment status';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
