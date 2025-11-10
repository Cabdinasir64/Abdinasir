import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, loginUser, getMeProfile } from '../services/userService';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(req: Request, res: Response) {
    try {

        const user = await createUser(req.body);

        res.status(201).json({ message: 'User registered successfully', user });

    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Registration failed' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });



        res.json({
            message: 'Login successful',
            redirectUrl: user.role === "admin" ? "/admin/dashboard" : "/"
        });

    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Login failed' });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });
        res.json({ message: "Logout successful" });
    } catch (error: any) {
        res.status(500).json({ message: "Logout failed" });
    }
}


export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await getMeProfile(req.user.userId);

        res.json({ user });

    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to retrieve user profile' });
    }
};