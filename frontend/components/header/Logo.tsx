"use client";
import React, { useMemo } from 'react';
import { motion, spring } from "framer-motion";
import Link from "next/link";

const Logo = () => {
    const name = "Abdinasir";

    const container = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
            },
        },
    }), []);

    const letterAnimation = useMemo(() => ({
        hidden: {
            opacity: 0,
            x: -30,
            rotate: -10
        },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: {
                type: spring,
                damping: 12,
                stiffness: 200,
            },
        },
    }), []);

    const nameChars = useMemo(() => name.split(""), []);

    return (
        <Link href="/" className="flex items-center gap-2 group select-none" dir="ltr">

            <motion.div
                className="relative w-10 h-10 hidden sm:flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl shadow-lg shadow-primary-500/20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.5
                }}
                whileHover={{
                    scale: 1.15,
                    rotate: 360,
                    borderRadius: "50%",
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
            >
                <span className="text-white font-bold text-xl">A</span>
            </motion.div>

            <motion.div
                className="flex items-center font-bold text-2xl text-surface-800 dark:text-surface-100 tracking-tight whitespace-nowrap"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {nameChars.map((letter, index) => (
                    <motion.span
                        key={index}
                        variants={letterAnimation}
                        className="inline-block hover:text-primary-500 transition-colors duration-300"
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </Link>
    );
};

export default React.memo(Logo);