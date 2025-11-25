"use client";
import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import { Skill, SkillsResponse } from '@/types/skill';

export const useSkills = () => {
    const { currentLang } = useLanguageStore();

    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            setLoading(true);
            setError(null);

            try {

                const baseUrl = process.env.NEXT_PUBLIC_API_URL

                const response = await fetch(`${baseUrl}/api/skills?lang=${currentLang}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch skills data');
                }

                const data: SkillsResponse = await response.json();

                setSkills(data.skills);

            } catch (err: any) {
                setError(err.message || "Something went wrong loading skills");
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [currentLang]);

    return { skills, loading, error };
};