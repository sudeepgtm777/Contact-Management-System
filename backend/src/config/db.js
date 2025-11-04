import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected Successfully!!!');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};
