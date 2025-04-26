import { NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin'; // adjust path as needed

const db = admin.database();

export async function POST(request) {
  try {
    const { sender, message } = await request.json();
    if (!sender || !message) {
      return NextResponse.json(
        { error: 'Missing sender or message' },
        { status: 400 }
      );
    }

    const newSms = {
      sender,
      message,
      receivedAt: new Date().toISOString(),
    };

    // Push to Firebase Realtime Database
    await db.ref('sms').push(newSms);

    return NextResponse.json({ success: true, received: newSms });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Invalid request or server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const snapshot = await db.ref('sms').once('value');
    const data = snapshot.val() || {};
    // Convert object to array
    const sms = Object.values(data);
    return NextResponse.json({ sms });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Could not read SMS data' },
      { status: 500 }
    );
  }
}

