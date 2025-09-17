import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import Entries from "../../../../../models/Entries";
import { getUserIdFromToken } from "../../../../../lib/auth-utils";

export async function GET(req: NextRequest, context: { params: Promise<{ groupName: string }> }) {
  await dbConnect();
  const userID = getUserIdFromToken(req);
  if (!userID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { groupName } = await context.params;
  const decodedGroupName = decodeURIComponent(groupName);
  try {
    const doc = await Entries.findOne({ userID });
    if (!doc) {
      return NextResponse.json({ data: [] });
    }
    const group = doc.groups.find((g) => g.name === decodedGroupName);
    if (!group) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ data: group.entries });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch entries";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ groupName: string }> }) {
  await dbConnect();
  const userID = getUserIdFromToken(req);
  if (!userID) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { groupName } = await context.params;
  const decodedGroupName = decodeURIComponent(groupName);
  const { entryName } = await req.json();
  if (!entryName) {
    return NextResponse.json({ success: false, error: "Entry name required" }, { status: 400 });
  }
  try {
    const doc = await Entries.findOne({ userID });
    if (!doc) {
      return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
    }
    await doc.addEntry(decodedGroupName, entryName);
    return NextResponse.json({ success: true, message: "Entry added successfully" });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to add entry";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
