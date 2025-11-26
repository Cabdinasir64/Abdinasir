"use client";
import { useState, useEffect, useMemo } from "react";
import { useLanguageStore } from "@/stores/languageStore";
import { Skill, SkillsResponse, SkillCategory } from "@/types/skill";

const ITEMS_PER_PAGE = 8;

export const useSkillsFilter = () => {
    const { currentLang } = useLanguageStore();

    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [displayedSkills, setDisplayedSkills] = useState<Skill[]>([]);

    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activeCategory, setActiveCategory] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchSkills = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/skills-cache?lang=${currentLang}`);
                if (!res.ok) throw new Error("Failed to load skills");

                const json: SkillsResponse = await res.json();
                setAllSkills(json.skills);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, [currentLang]);

    useEffect(() => {
        const processData = async () => {
            setFiltering(true);


            await new Promise(resolve => setTimeout(resolve, 600));

            let result = [...allSkills];

            if (activeCategory !== "ALL") {
                result = result.filter(skill =>
                    skill.category.includes(activeCategory as SkillCategory)
                );
            }

            if (sortBy === "newest") {
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } else if (sortBy === "oldest") {
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            } else if (sortBy === "name") {
                result.sort((a, b) => a.name.localeCompare(b.name));
            }

            setDisplayedSkills(result);
            setCurrentPage(1);
            setFiltering(false);
        };

        if (!loading) {
            processData();
        }
    }, [allSkills, activeCategory, sortBy, loading]);

    const totalPages = Math.ceil(displayedSkills.length / ITEMS_PER_PAGE);
    const paginatedSkills = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return displayedSkills.slice(start, start + ITEMS_PER_PAGE);
    }, [displayedSkills, currentPage]);

    return {
        skills: paginatedSkills,
        loading,
        filtering,
        error,
        activeCategory,
        setActiveCategory,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        totalPages
    };
};