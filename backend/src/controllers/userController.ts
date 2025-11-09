import { Request, Response } from 'express';
import { createUser } from '../services/userService';

export async function registerUser(req: Request, res: Response) {
    try {

        const user = await createUser(req.body);

        res.status(201).json({ message: 'User registered successfully', user });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
