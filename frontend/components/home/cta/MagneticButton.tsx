"use client";
import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import Link from "next/link";

interface MagneticButtonProps {
    children: ReactNode;
    href: string;
}

const MagneticButton = ({ children, href }: MagneticButtonProps) => {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;

        if (!button || !text) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = button.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 1,
                ease: "power3.out",
            });

            gsap.to(text, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 1,
                ease: "power3.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to([button, text], {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)",
            });
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <Link
            ref={buttonRef}
            href={href}
            className="relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-bold text-white bg-primary-600 rounded-full group shadow-2xl shadow-primary-500/30"
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-500 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span ref={textRef} className="relative z-10 flex items-center gap-2 text-lg">
                {children}
            </span>
        </Link>
    );
};

export default MagneticButton;