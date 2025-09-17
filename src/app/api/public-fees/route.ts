import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entries from '@/models/Entries';
import User from '@/models/User';
import { successResponse, handleApiError } from '@/lib/api-utils';

export async function GET(_req: NextRequest) {
  try {
    await dbConnect();
    // Get all entries for all users (public view)
    const entriesDocs = await Entries.find({});
    const users = await User.find({});

    // Format response: userName, group names, entry names, monthly payment status
    const result = entriesDocs.map((doc) => {
      const docObj = (doc.toObject() as unknown) as Record<string, unknown>;
      const user = users.find(u => {
        // @ts-expect-error: Mongoose _id type
        return u._id.equals((docObj.userID as { toString: () => string }));
      });
      const groups = Object.keys(docObj).filter(key => key !== '_id' && key !== 'userID' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v');
      return {
        userID: (docObj.userID as { toString: () => string }).toString(),
        userName: user ? user.userName : '',
        groups: groups.map((groupName: string) => {
          const groupObj = docObj[groupName] as Record<string, { monthlyPaymentStatus: Record<number, boolean> }>;
          return {
            groupName,
            entries: Object.keys(groupObj || {}).map((entryName: string) => {
              const entryObj = groupObj[entryName];
              return {
                entryName,
                monthlyPaymentStatus: entryObj?.monthlyPaymentStatus || {}
              };
            })
          };
        })
      };
    });

    return successResponse(result, 'Public fee status fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
