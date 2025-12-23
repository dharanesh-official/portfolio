import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Admin } from '@/lib/models';

// GET: List all admins
export async function GET() {
    await dbConnect();
    try {
        const admins = await Admin.find({});
        const safeAdmins = admins.map((user: any) => ({ id: user._id, username: user.username }));
        return NextResponse.json(safeAdmins);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
    }
}

// POST: Add new admin
export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, password } = await request.json();

        if (await Admin.findOne({ username })) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }

        const newAdmin = await Admin.create({ username, password });

        return NextResponse.json({ success: true, admin: { id: newAdmin._id, username: newAdmin.username } });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add admin" }, { status: 500 });
    }
}

// DELETE: Remove admin
export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const count = await Admin.countDocuments();
        if (count <= 1) {
            return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
        }

        await Admin.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
    }
}
