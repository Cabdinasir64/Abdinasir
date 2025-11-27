export enum SkillCategory {
    PROGRAMMING = "PROGRAMMING",
    FRONTEND = "FRONTEND",
    BACKEND = "BACKEND",
    FRAMEWORK = "FRAMEWORK",
    STATEMANAGMENT= "State Management",
    DATABASE = "DATABASE",
    TOOL = "TOOL",
    CLOUD = "CLOUD"
}

export interface Skill {
    id: string;
    userId: string;
    name: string;
    level: string;
    category: SkillCategory[];
    skillImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface SkillsResponse {
    skills: Skill[];
}