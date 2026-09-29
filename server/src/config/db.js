import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management';
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Connection Error] ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Disconnected] Attempting to reconnect...');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Failed] ${error.message}`);
    process.exit(1);
  }
};
