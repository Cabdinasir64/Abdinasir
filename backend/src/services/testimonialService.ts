import prisma from "../prisma/prismaClient";

interface TestimonialInput {
    userId: string
    name: string;
    image?: string;
    position?: string;
    text: { en: string; ar: string; so: string };
}

export const createTestimonial = async (data: TestimonialInput) => {
    return prisma.testimonial.create({ data });
};

export const getAllTestimonials = async () => {
    return prisma.testimonial.findMany();
};

export const getTestimonialById = async (id: string) => {
    return prisma.testimonial.findUnique({ where: { id } });
};

export const updateTestimonial = async (id: string, data: Partial<TestimonialInput>) => {
    return prisma.testimonial.update({ where: { id }, data });
};

export const deleteTestimonial = async (id: string) => {
    return prisma.testimonial.delete({ where: { id } });
};
