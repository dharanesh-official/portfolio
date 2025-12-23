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
            return JSON.parse(JSON.stringify(data));
        }

        // Return local data if DB empty
        return contentData;
    } catch (e) {
        console.error("Failed to fetch from DB, using fallback", e);
        return contentData;
    }
}
