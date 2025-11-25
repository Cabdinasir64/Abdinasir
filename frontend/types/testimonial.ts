export interface Testimonial {
    id: string;
    userId: string;
    name: string;
    image: string;
    text: string;
    position: string;
    createdAt: string;
    updatedAt: string;
}

export interface TestimonialsResponse {
    testimonials: Testimonial[];
}