import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import UserRoutes from './routes/userRoutes';
import ipRoutes from "./routes/ipRoutes";
import SkillRoutes from "./routes/skillRoutes";
import GalleryRoutes from "./routes/galleryRoutes";
import TestimonialRoutes from "./routes/testimonialRoutes";

dotenv.config();

const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [];
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, 'access.log'),
        { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    app.use(morgan('dev'));
}


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


const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Too many requests, please try again later.'
});
app.use(generalLimiter);


app.use('/api/user', UserRoutes);
app.use('/api/skills', SkillRoutes);
app.use('/api/galleries', GalleryRoutes);
app.use('/api/testimonials', TestimonialRoutes);
app.use('/ip', ipRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
