import express from 'express';
import { connectDB } from './config/db.js';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('src/config/config.env') });

const app = express();

connectDB();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
