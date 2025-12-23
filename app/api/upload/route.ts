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

        // Convert file to Base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = file.type || 'image/png';
        const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

        // Update the image field in the Portfolio document
        // We update the ONLY document that exists (or create one)
        await Portfolio.findOneAndUpdate({},
            { $set: { "personal.image": base64Image } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
