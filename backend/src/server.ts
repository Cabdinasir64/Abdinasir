import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import UserRoutes from './routes/userRoutes'

dotenv.config();

const PORT = process.env.PORT;
const sessionSecret = process.env.SESSION_SECRET!

const app = express();

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    name: 'portfolio.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none"
    }
}));


app.use('/api/user', UserRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


