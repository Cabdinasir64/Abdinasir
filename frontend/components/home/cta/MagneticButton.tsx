"use client";
import { useRef, useEffect, ReactNode, memo } from "react";
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

        const xToBtn = gsap.quickTo(button, "x", { duration: 1, ease: "power3.out" });
        const yToBtn = gsap.quickTo(button, "y", { duration: 1, ease: "power3.out" });

        const xToText = gsap.quickTo(text, "x", { duration: 1, ease: "power3.out" });
        const yToText = gsap.quickTo(text, "y", { duration: 1, ease: "power3.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = button.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xToBtn(x * 0.3);
            yToBtn(y * 0.3);
            xToText(x * 0.1);
            yToText(y * 0.1);
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

export default memo(MagneticButton);