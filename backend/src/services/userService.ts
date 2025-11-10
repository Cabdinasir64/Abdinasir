import prisma from '../prisma/prismaClient';
import { hashPassword, comparePassword } from '../utils/hash';

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

export async function loginUser(email: string, password: string) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
}

export const getMeProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};