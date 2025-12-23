import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Portfolio } from '@/lib/models';
import contentData from '@/app/data/content.json'; // Fallback/Seed data

export async function GET() {
    await dbConnect();

    try {
        let data = await Portfolio.findOne();

        if (!data) {
            // Seed if empty
            console.log("No data found in DB, seeding from local JSON...");
            data = await Portfolio.create(contentData);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Database Error:", error);
        // Fallback to local JSON if DB fails (e.g. invalid connection string)
        return NextResponse.json(contentData);
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const newData = await request.json();

        // Update the single portfolio document, or create if not exists
        // We use upsert just in case, though GET should have seeded it.
        // preserving the existing image if not provided in update (though frontend sends whole object usually)
        // Actually, frontend sends whole object. But image might be missing from frontend state if we don't handle it carefully.
        // The frontend 'data' state doesn't store the base64 string usually (it's too big). 
        // Wait, if frontend fetches data, it gets the image string.
        // If I save 'newData', I must ensure the image field is preserved if I want to update other fields but keep image.

        const currentParam = await Portfolio.findOne();
        if (currentParam && currentParam.personal.image && !newData.personal.image) {
            // If the incoming data doesn't have an image but the DB does, keep the DB one.
            // This depends on how the frontend sends data. 
            // AdminPage uses 'data' state. If 'image' is part of 'personal', it will be in 'newData'.
            // If the 'image' field is large, it might be heavy to send back and forth.
            // But for < 4MB it's okay.
            newData.personal.image = currentParam.personal.image;
        }

        await Portfolio.findOneAndUpdate({}, newData, { upsert: true, new: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
