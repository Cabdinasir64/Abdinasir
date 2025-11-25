"use client";
import { motion } from "framer-motion";
import GridPattern from '@/assets/grid-pattern.png'

const Background = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-primary-500/20 blur-3xl"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-secondary-200/20 blur-3xl"
            />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${GridPattern.src})`,
                    backgroundPosition: "100%",
                    backgroundSize: "cover",
                    opacity: 0.25,
                }}
            />
        </div>
    );
};

export default Background;