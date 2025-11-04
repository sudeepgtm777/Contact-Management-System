import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);

    console.log('DataBase Connected Succesfully!!!');
  } catch (err) {
    console.log('Error connecting to database', err);
  }
};
