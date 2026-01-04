import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI;

// Fix common issue where mongodb+srv connection strings include a port number
if (MONGODB_URI) {
    MONGODB_URI = MONGODB_URI.trim();

    if (MONGODB_URI.startsWith('mongodb+srv://')) {
        // Robustly remove port number if present, avoiding the password section
        if (MONGODB_URI.includes('@')) {
            const parts = MONGODB_URI.split('@');
            const credentials = parts.slice(0, -1).join('@');
            let hostAndPath = parts[parts.length - 1];

            // Remove port: matches :digits followed by / or ? or end of string
            // This regex creates a captured group for the port but we just replace the match of :digits with empty string
            // We use a positive lookahead for the terminator to avoid consuming it if it's needed (though replacing :123/ with / is fine)
            hostAndPath = hostAndPath.replace(/:(\d+)(?=[/?]|$)/, '');

            MONGODB_URI = `${credentials}@${hostAndPath}`;
        } else {
            // No credentials case (unlikely for Atlas but possible)
            MONGODB_URI = MONGODB_URI.replace(/:(\d+)(?=[/?]|$)/, '');
        }
    }
}

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

interface GlobalMongoose {
    conn: any;
    promise: any;
}

declare global {
    var mongoose: GlobalMongoose;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
