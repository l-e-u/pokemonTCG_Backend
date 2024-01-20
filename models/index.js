import mongoose from 'mongoose';

const connectToDatabase = () => mongoose.connect();

export { connectToDatabase };