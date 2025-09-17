import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entries from '@/models/Entries';
import User from '@/models/User';
import { successResponse, handleApiError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get('month'));
    const paid = searchParams.get('paid'); // 'true' or 'false'
    const group = searchParams.get('group'); // group name (optional)

    const paidStr = typeof paid === 'string' ? paid : '';
    if (!month || !['true', 'false'].includes(paidStr)) {
      return successResponse([], 'Invalid query params');
    }

    const entriesDocs = await Entries.find({});
    const users = await User.find({});

    // Filter entries by month, paid/unpaid, and group
    interface EntryStatus {
        [month: number]: boolean;
    }

    interface EntryDetail {
        entryName: string;
        monthlyPaymentStatus: EntryStatus;
    }

    interface GroupDetail {
        groupName: string;
        entries: EntryDetail[];
    }

    interface UserResult {
        userID: string;
        userName: string;
        groups: GroupDetail[];
    }

    const result: UserResult[] = entriesDocs.map((doc) => {
        const docObj = (doc.toObject() as unknown) as Record<string, unknown>;
        const user = users.find((u) => {
            // @ts-expect-error: Mongoose _id type
            return u._id.equals((docObj.userID as { toString: () => string }));
        });
        const groups: string[] = Object.keys(docObj).filter(key => !['_id', 'userID', 'createdAt', 'updatedAt', '__v'].includes(key));
        return {
            userID: (docObj.userID as { toString: () => string }).toString(),
            userName: user ? user.userName : '',
            groups: groups
                .filter((groupName: string) => !group || groupName === group)
                .map((groupName: string): GroupDetail => {
                    const groupObj = docObj[groupName] as Record<string, { monthlyPaymentStatus: EntryStatus }>;
                    return {
                        groupName,
                        entries: Object.keys(groupObj || {})
                            .filter((entryName: string) => {
                                const entryObj = groupObj[entryName];
                                const status = entryObj?.monthlyPaymentStatus?.[month];
                                return paidStr === 'true' ? status === true : status === false;
                            })
                            .map((entryName: string): EntryDetail => {
                                const entryObj = groupObj[entryName];
                                return {
                                    entryName,
                                    monthlyPaymentStatus: entryObj?.monthlyPaymentStatus || {}
                                };
                            })
                    };
                })
        };
    }).filter((user: UserResult) => user.groups.some(g => g.entries.length > 0));

    return successResponse(result, 'Filtered fee status fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
