import prisma from "../prisma/prismaClient";
import mongoose from 'mongoose'; 

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

interface TestimonialInput {
    userId: string
    name: string;
    image?: string;
    position?: string;
    text: { en: string; ar: string; so: string };
}

export const createTestimonial = async (data: TestimonialInput) => {
    if (!data.userId || !isValidObjectId(data.userId)) {
        throw new Error("Invalid or missing userId.");
    }

    if (!data.name || data.name.trim().length === 0) {
        throw new Error("Testimonial name is required.");
    }

    if (!data.text || !data.text.en || !data.text.so || !data.text.ar ||
        data.text.en.trim().length === 0 || data.text.so.trim().length === 0 || data.text.ar.trim().length === 0) {
        throw new Error("Testimonial text is required.");
    }

    if (data.position && data.position.trim().length === 0) {
        throw new Error("Testimonial position cannot be an empty string.");
    }
    if (data.image && data.image.trim().length === 0) {
        throw new Error("Testimonial image path cannot be an empty string.");
    }

    return prisma.testimonial.create({ data });
};

export const getAllTestimonials = async () => {
    return prisma.testimonial.findMany();
};

export const getTestimonialById = async (id: string) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Testimonial ID format.");
    }
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    return testimonial;
};

export const updateTestimonial = async (id: string, data: Partial<TestimonialInput>) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Testimonial ID format.");
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Testimonial not found.");
    }

    if (data.name !== undefined) {
        if (data.name.trim().length === 0) {
            throw new Error("Testimonial name cannot be empty if provided.");
        }
    }

    if (data.text) {
        if (!data.text.en || data.text.en.trim().length === 0 ||
            !data.text.so || data.text.so.trim().length === 0 ||
            !data.text.ar || data.text.ar.trim().length === 0) {
            throw new Error("Testimonial text is required if text field is provided for update.");
        }
    }

    if (data.position !== undefined) {
        if (data.position.trim().length === 0) {
            throw new Error("Testimonial position cannot be empty if provided.");
        }
    }

    if (data.image !== undefined) {
        if (data.image.trim().length === 0) {
            throw new Error("Testimonial image path cannot be empty if provided.");
        }
    }

    return prisma.testimonial.update({ where: { id }, data });
};

export const deleteTestimonial = async (id: string) => {
    if (!isValidObjectId(id)) {
        throw new Error("Invalid Testimonial ID format.");
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Testimonial not found.");
    }

    return prisma.testimonial.delete({ where: { id } });
};