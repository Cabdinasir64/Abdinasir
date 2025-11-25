"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    index: number;
}

const ServiceCard = ({ title, description, icon, index }: ServiceCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-white dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative z-10 w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-surface-50 dark:bg-surface-800 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary-500/30">
                <div className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors">
                    {title}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 group-hover:w-full" />
        </motion.div>
    );
};

export default ServiceCard;