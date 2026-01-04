import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Portfolio } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    try {
        const data = await Portfolio.findOne({}, { 'personal.image': 1 }); // only fetch image

        if (!data || !data.personal || !data.personal.image) {
            // Return 404 or redirect to a placeholder
            return new NextResponse('Image not found', { status: 404 });
        }

        const base64String = data.personal.image;

        // Extract content type and data
        // Format: data:image/png;base64,.....
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            return new NextResponse('Invalid image data', { status: 500 });
        }

        const type = matches[1];
        const base64Content = matches[2];
        const buffer = Buffer.from(base64Content, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': type,
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache heavily
            },
        });
    } catch (error) {
        console.error("Image Fetch Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
