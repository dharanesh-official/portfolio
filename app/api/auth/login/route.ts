import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Admin } from '@/lib/models';
import localAdmins from '@/app/data/admins.json';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, password } = await request.json();

        // Check DB
        let user = await Admin.findOne({ username, password });

        if (!user) {
            // Fallback: Check if DB is empty, maybe seed from local admins?
            const count = await Admin.countDocuments();
            if (count === 0) {
                // Seed
                for (const admin of localAdmins) {
                    await Admin.create({ username: admin.username, password: admin.password });
                }
                // Retry login
                user = await Admin.findOne({ username, password });
            }
        }

        if (user) {
            return NextResponse.json({ success: true, user: { username: user.username } });
        } else {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
