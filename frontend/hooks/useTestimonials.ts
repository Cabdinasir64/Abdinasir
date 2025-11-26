"use client";
import { useState, useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";
import { Testimonial, TestimonialsResponse } from "@/types/testimonial";

export const useTestimonials = () => {
  const { currentLang } = useLanguageStore();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {

        const response = await fetch(`/api/testimonials-cache?lang=${currentLang}`);


        if (!response.ok) throw new Error("Failed to fetch testimonials");

        const json: TestimonialsResponse = await response.json();
        setTestimonials(json.testimonials);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();


  }, [currentLang]);

  return { testimonials, loading, error };
};
