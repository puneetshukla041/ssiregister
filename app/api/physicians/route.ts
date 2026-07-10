import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Physician from '@/models/Physician';

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value: string) {
  return value.replace(/[^0-9]/g, '').length >= 7;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      firstName: String(body?.firstName || '').trim(),
      lastName: String(body?.lastName || '').trim(),
      email: String(body?.email || '').trim(),
      phone: String(body?.phone || '').trim(),
      hospital: String(body?.hospital || '').trim(),
      specialty: String(body?.specialty || '').trim(),
      remark: String(body?.remark || '').trim(),
    };

    if (!payload.firstName || !payload.lastName || !validEmail(payload.email) || !validPhone(payload.phone) || !payload.hospital) {
      return NextResponse.json({ error: 'Please fill all required fields correctly.' }, { status: 400 });
    }

    await connectToDatabase();
    const doctor = await Physician.create(payload);

    return NextResponse.json({ success: true, id: doctor._id }, { status: 201 });
  } catch (error) {
    console.error('Physician registration failed', error);
    return NextResponse.json(
      {
        error: 'Unable to save registration right now. Please verify your MongoDB connection.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
