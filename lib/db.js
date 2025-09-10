import mongoose from 'mongoose';
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('Missing MONGO_URI');
}

//Grabs the URI from .env (if it's not set, crash early)
let cached = global._mongoose;
if (!cached) cached  = global._mongoose = { conn: null, promise: null };

//Global cache so we don’t re-connect on every API call in dev
//Exports a function can call in any route to connect once and reuse the connection
//Otherwise every request would open a new DB connection -> slow and might crash Mongo
export default async function dbConnect() {
    if (cached.conn) return cached.conn; //use existing connection
    if (!cached.promise) {
        cached.promise = mongoose.connect(uri).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
