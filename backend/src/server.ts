import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import UserRoutes from './routes/userRoutes'
import ipRoutes from "./routes/ipRoutes";

dotenv.config();

const PORT = process.env.PORT;
const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [];
const app = express();


app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use('/api/user', UserRoutes);
app.use("/ip", ipRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


