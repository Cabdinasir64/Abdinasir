import { Request, Response } from 'express';
import { createUser, loginUser } from '../services/userService';

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