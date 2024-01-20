import mongoose from 'mongoose';

const connectToDatabase = (uri) => mongoose.connect(uri);

export { connectToDatabase };