import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Portfolio } from '@/lib/models';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type (PDF only to prevent misuse)
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        // Validate file size (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
        }

        // Convert file to Base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Standard base64 with data URI prefix
        const base64Resume = `data:application/pdf;base64,${buffer.toString('base64')}`;

        // Update the resume field in the Portfolio document
        await Portfolio.findOneAndUpdate({},
            { $set: { "personal.resume": base64Resume } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Resume Upload error:", error);
        return NextResponse.json({ error: "Resume upload failed" }, { status: 500 });
    }
}
