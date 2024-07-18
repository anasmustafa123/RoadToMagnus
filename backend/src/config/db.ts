import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect((uri)?uri:"", {
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
