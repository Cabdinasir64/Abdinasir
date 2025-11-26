"use client";
import { useState, useEffect } from "react";
import { Project, ProjectsResponse } from "@/types/project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects-cache`);

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const json: ProjectsResponse = await response.json();

        const sortedAndLimitedProjects = json.data
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setProjects(sortedAndLimitedProjects);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};
