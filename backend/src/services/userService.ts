import prisma from '../../prisma/prismaClient';
import { hashPassword } from '../utils/hash';

interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
}

export async function createUser(data: CreateUserInput) {
    const existingUsers = await prisma.user.findMany();

    if (existingUsers.length > 0) {
        throw new Error('User already exists. Only one user allowed.');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            profileImage: data.profileImage,
        },
    });

    return user;
}
