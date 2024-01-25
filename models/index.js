import mongoose from 'mongoose';

const connectToDatabase = () => mongoose.connect(process.env.MONGODB_URI);

export { connectToDatabase };