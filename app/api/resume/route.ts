import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Portfolio } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    try {
        const data = await Portfolio.findOne({}, { 'personal.resume': 1 }); // only fetch resume

        if (!data || !data.personal || !data.personal.resume) {
            return new NextResponse('Resume not found', { status: 404 });
        }

        const base64String = data.personal.resume;
        // Strip the data URI prefix if present (e.g. "data:application/pdf;base64,")
        const base64Content = base64String.split(';base64,').pop();

        if (!base64Content) {
            return new NextResponse('Invalid resume data', { status: 500 });
        }

        const buffer = Buffer.from(base64Content, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="resume.pdf"',
            },
        });
    } catch (error) {
        console.error("Resume Fetch Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
