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
  status: string; // "PUBLISHED", "PENDING", etc.
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
  PORTFOLIO = "PORTFOLIO",
  WEB_DESIGN = "WEB_DESIGN",
  MOBILE_APP = "MOBILE_APP",
  UI_UX = "UI_UX",
  MACHINE_LEARNING = "MACHINE_LEARNING",
  OTHER = "OTHER"
}