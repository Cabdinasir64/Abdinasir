export interface Project {
  id: string;
  userID: string;
  name: string;
  description: string;
  mainImage: string | null;
  images: string[];
  categories: string[];
  tech: string[];
  link: string | null;
  status: string; 
  likes: number;
  rating: number;
  comments: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectsApiResponse {
  data: Project[];
  pagination: Pagination;
}

export enum ProjectCategory {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  FULL_STACK = "FULL_STACK",
  MOBILE_APP = "MOBILE_APP",
  SAAS = "SAAS",
  UI_UX = "UI_UX",
  OTHER = "OTHER"
}