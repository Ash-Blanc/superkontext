import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

// TODO: Set your Google Sheet ID here
const SHEET_ID = '1o9DYVbWZsnk7QPYkLgICA6M03JsAd6vSL_MU-aAN8Rw';
// TODO: Set the path to your service account JSON file
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-service-account.json');

async function getSheetsClient() {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.GoogleAuth({ credentials, scopes });
    return google.sheets({ version: 'v4', auth });
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ success: false, error: 'Invalid email.' }, { status: 400 });
        }

        // Append to Google Sheet
        const sheets = await getSheetsClient();
        const timestamp = new Date().toISOString();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'A:B',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[email, timestamp]],
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Waitlist error:', err);
        return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 });
    }
} 