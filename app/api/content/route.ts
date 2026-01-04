import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Portfolio } from '@/lib/models';
import contentData from '@/app/data/content.json'; // Fallback/Seed data

export const dynamic = 'force-dynamic';


export async function GET() {
    await dbConnect();

    try {
        // Use lean() to get a plain JS object we can modify
        let data = await Portfolio.findOne().lean();

        if (!data) {
            // Seed if empty
            console.log("No data found in DB, seeding from local JSON...");
            data = await Portfolio.create(contentData);
            // Re-fetch as lean or just use the created doc converted to object
            if (data && typeof data.toObject === 'function') data = data.toObject();
        }

        // Optimize: Don't send the heavy resume base64 string to the client
        // The client only needs to know if it exists to show the button
        if (data && data.personal) {
            data.personal.hasResume = !!data.personal.resume;
            delete data.personal.resume;
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

        // Remove immutable/system fields that shouldn't be updated manually
        // This fixes "Mod on _id not allowed" errors when sending back a full document
        if (newData._id) delete newData._id;
        if (newData.__v) delete newData.__v;
        if (newData.createdAt) delete newData.createdAt;
        if (newData.updatedAt) delete newData.updatedAt;

        if (currentParam && currentParam.personal) {
            // Ensure personal object exists in newData if we are patching it
            if (!newData.personal) newData.personal = {};

            // Preserve existing image if not provided in update
            if (currentParam.personal.image && !newData.personal.image) {
                newData.personal.image = currentParam.personal.image;
            }

            // Preserve existing resume if not provided in update
            // Frontend explicitly removes resume to avoid payload size limits, so we MUST restore it from DB
            if (currentParam.personal.resume && !newData.personal.resume) {
                newData.personal.resume = currentParam.personal.resume;
            }
        }

        await Portfolio.findOneAndUpdate({}, newData, { upsert: true, new: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to save data" }, { status: 500 });
    }
}
