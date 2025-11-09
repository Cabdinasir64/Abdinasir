import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import UserRoutes from './routes/userRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const sessionSecret = process.env.SESSION_SECRET!

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use(session({
    name: 'portfolio.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
    }
}));


app.use('/api/user', UserRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
