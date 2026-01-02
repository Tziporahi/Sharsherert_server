import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import userRouter from './routes/user.js';
import itemRouter from './routes/item.js';
import orderRouter from './routes/order.js';
import {connectDB} from './config/db.js';


const app = express();

app.use(express.json());
app.use(cors());
connectDB();

app.use('/api', itemRouter);
app.use('/api', orderRouter);
app.use('/api', userRouter);

const port=process.env.PORT || 4400;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

