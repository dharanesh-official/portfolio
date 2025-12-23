"use client";

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function Thanks() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-green-50 p-6 rounded-full mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Message Sent!</h1>
            <p className="text-slate-600 text-lg mb-8 max-w-md">
                Thanks for reaching out. I've received your message and will get back to you as soon as possible.
            </p>
            <Link
                href="/"
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
