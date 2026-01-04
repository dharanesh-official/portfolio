import dbConnect from '@/lib/db';
import { Portfolio } from '@/lib/models';
import contentData from '@/app/data/content.json';

export async function getPortfolioData() {
    try {
        await dbConnect();
        const data = await Portfolio.findOne().lean(); // lean() returns plain object
        if (data) {
            // Need to convert _id and dates to string if passing to client component, though HomeClient takes 'data' which is passed from Server Component.
            // Next.js Server Components require serializable data (simple JSON). Mongoose documents have methods etc.
            // JSON.parse(JSON.stringify) is a crude but effective way to serialize
            const serialized = JSON.parse(JSON.stringify(data));

            // Populate flags and strip heavy data for performance
            if (serialized.personal) {
                serialized.personal.hasResume = !!serialized.personal.resume;
                delete serialized.personal.resume;

                serialized.personal.hasImage = !!serialized.personal.image;
                // We keep image for now or we will break the site unless we implement /api/image loading
                // Actually, let's optimize speed: If we implement /api/image, we can delete this too.
                // For now, let's KEEP image but ensure hasResume is set.
                // The user complained about slowness, so removing image from initial payload is key.
                // I will delete image here and update HomeClient to fetch it.
                delete serialized.personal.image;
            }
            return serialized;
        }

        // Return local data if DB empty
        return contentData;
    } catch (e) {
        console.error("Failed to fetch from DB, using fallback", e);
        return contentData;
    }
}
