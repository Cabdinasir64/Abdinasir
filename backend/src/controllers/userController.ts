import { Request, Response } from 'express';
import { createUser, loginUser, getMeProfile } from '../services/userService';
import { AuthRequest } from '../middleware/authMiddleware';

export async function registerUser(req: Request, res: Response) {
    try {

        const user = await createUser(req.body);

        res.status(201).json({ message: 'User registered successfully', user });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        req.session.user = {
            userId: user.id,
            username: user.username,
            role: user.role
        };

        let redirectUrl = '/';
        if (user.role === 'admin') {
            redirectUrl = '/admin/dashboard';
        }

        res.json({
            message: 'Login successful',
            redirectUrl
        });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed', });
            }

            res.clearCookie('portfolio.sid');
            res.json({ message: 'Logout successful' });
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
};