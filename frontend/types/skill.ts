export interface Skill {
    id: string;
    userId?: string;
    name: string;
    level: string;
    category?: string[];
    skillImage: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SkillsResponse {
    skills: Skill[];
}