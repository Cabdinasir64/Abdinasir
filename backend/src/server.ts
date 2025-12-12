import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import UserRoutes from './routes/userRoutes';
import ipRoutes from "./routes/ipRoutes";
import SkillRoutes from "./routes/skillRoutes";
import TestimonialRoutes from "./routes/testimonialRoutes";
import ProjectRoutes from "./routes/projectRoutes";
import { requestLogger } from "./middleware/logger";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin: 'https://www.abdinasir.dev',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: 'Too many requests, please try again later.'
});

app.use(generalLimiter);
app.use(requestLogger);

app.use('/api/user', UserRoutes);
app.use('/api/skills', SkillRoutes);
app.use('/api/testimonials', TestimonialRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/ip', ipRoutes);



app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
