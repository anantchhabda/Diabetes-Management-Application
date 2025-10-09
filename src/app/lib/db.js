import mongoose from "mongoose";
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("Missing MONGO_URI");
}

//grab url from .env
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

//global cache so we don’t re-connect on every API call in dev
export default async function dbConnect() {
  if (cached.conn) return cached.conn; //use existing connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
