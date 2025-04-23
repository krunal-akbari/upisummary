// app/api/sms/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'api', 'sms.json');

function readSmsData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return fileData ? JSON.parse(fileData) : [];
  } catch (err) {
    console.error('Error reading SMS data:', err);
    return [];
  }
}

function saveSmsData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving SMS data:', err);
  }
}

export async function POST(request) {
  try {
    const { sender, message } = await request.json();
    if (!sender || !message) {
      return NextResponse.json(
        { error: 'Missing sender or message' },
        { status: 400 }
      );
    }

    const smsData = readSmsData();
    const newSms = {
      sender,
      message,
      receivedAt: new Date().toISOString(),
    };
    smsData.push(newSms);
    saveSmsData(smsData);

    return NextResponse.json({ success: true, received: newSms });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request or server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const smsData = readSmsData();
    return NextResponse.json({ sms: smsData });
  } catch (err) {
    return NextResponse.json(
      { error: 'Could not read SMS data' },
      { status: 500 }
    );
  }
}

