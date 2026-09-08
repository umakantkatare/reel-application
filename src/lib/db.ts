import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not defined");
}

let dbConnected = global.mongoose;

if (!dbConnected) {
  dbConnected = global.mongoose = { conn: null, promise: null };
}

export async function connectToDb() {
  if (dbConnected.conn) {
    return dbConnected.conn;
  }

  if (!dbConnected.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    dbConnected.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    dbConnected.conn = await dbConnected.promise;
    console.log("db connected successfully!");
  } catch (error) {
    dbConnected.promise = null;
    throw new Error(`db not connected!, ${error}`);
  }

  return dbConnected.conn;
}
