import mongoose from "mongoose";
import { serverConfig } from "@/lib/config";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!serverConfig.mongodbUri) {
    throw new Error("Please define MONGODB_URI in your environment variables.");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(serverConfig.mongodbUri, {
      dbName: serverConfig.mongodbDbName,
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    // Reset promise on failure so future requests can retry cleanly.
    cache.promise = null;
    throw error;
  }
}
