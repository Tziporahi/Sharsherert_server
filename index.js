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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ title: "Not Found", message: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ title: "Server Error", message: err.message || err });
});

const port = process.env.PORT || 4400;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
})

