import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached = globalWithMongoose.mongooseCache ??= {
  conn: null,
  promise: null,
};

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI;
      const fallbackUri = process.env.MONGODB_FALLBACK_URI;
      const uris = [primaryUri, ...(fallbackUri ? [fallbackUri] : [])].filter(
        (value): value is string => Boolean(value)
      );

      if (!primaryUri) {
        throw new Error('No MongoDB URI found. Add MONGODB_URI or MONGO_URI to your .env.local file.');
      }

      let lastError: unknown;

      for (const uri of uris) {
        try {
          const connection = await mongoose.connect(uri, {
            dbName: process.env.MONGODB_DB || process.env.MONGO_DB || undefined,
            serverSelectionTimeoutMS: 7000,
            socketTimeoutMS: 10000,
          });

          cached.conn = connection;
          return connection;
        } catch (error) {
          lastError = error;
        }
      }

      throw new Error(
        `Unable to connect to MongoDB. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}. If you are using Atlas, allow your current IP in Atlas Network Access or use a local MongoDB URI.`
      );
    })().catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  return cached.promise;
}
