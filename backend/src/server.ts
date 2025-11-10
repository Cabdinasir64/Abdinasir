import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import dotenv from 'dotenv';
import UserRoutes from './routes/userRoutes'
import ipRoutes from "./routes/ipRoutes";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/api/user', UserRoutes);
app.use("/ip", ipRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


