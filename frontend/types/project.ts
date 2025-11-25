export interface Project {
  id: string;
  userID: string;
  name: string;
  description: string;
  mainImage: string;
  images: string[];
  categories: string[];
  tech: string[];
  link: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
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

export interface ProjectsResponse {
  data: Project[]; 
  pagination: Pagination;
}