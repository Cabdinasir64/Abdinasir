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
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });

    if (!testimonial) return null;
    return testimonial;
};


export const updateTestimonial = async (id: string, data: Partial<TestimonialInput>) => {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.testimonial.update({ where: { id }, data });
};


export const deleteTestimonial = async (id: string) => {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.testimonial.delete({ where: { id } });
};
