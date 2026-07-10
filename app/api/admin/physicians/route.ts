import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Physician from '@/models/Physician';

const USERNAME = 'ssimaya';
const PASSWORD = 'ssimaya';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username !== USERNAME || password !== PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const records = await Physician.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Admin fetch failed', error);
    return NextResponse.json({ error: 'Unable to load registrations.' }, { status: 500 });
  }
}
