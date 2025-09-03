import mongoose from 'mongoose';
const uri = process.env.MONGO_URI;

let cached = global._mongoose;
if (!cached) cached  = global._mongoose = { conn: null, promise: null };

export default async function dbConnect() {
    if (cached.conn) return cached.conn; //use existing connection
    if (!cached.promise) {
        cached.promise = mongoose.connect(uri).then(m => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
