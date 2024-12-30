import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import {connectDB} from './config/db.js';
import cors from 'cors';



dotenv.config();
connectDB();

const app=express();
app.use(cors({ origin: 'https://train-reservation-system-theta.vercel.app/', }));
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/bookings',bookingRoutes);

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
