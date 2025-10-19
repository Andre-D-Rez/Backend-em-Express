import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri);
  isConnected = true;
  console.log('Connected to MongoDB');
};

export const ensureDBConnected = async () => {
  if (!isConnected) {
    await connectDB();
  }
};
