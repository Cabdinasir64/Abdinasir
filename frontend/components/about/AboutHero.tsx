"use client";
import React, { memo } from "react"; 
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import MyCoverImage from "@/assets/A31.png";

const AboutHero = () => {
    const { t } = useTranslation();

    return (
        <section className="relative h-[65vh] min-h-[550px] w-full flex items-end pb-20 md:items-center md:pb-0 justify-center overflow-hidden">

            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src={MyCoverImage}
                    alt="Abdinasir Profile"
                    fill
                    priority
                    quality={90}
                    placeholder="blur" 
                    className="object-cover object-top md:object-[center_20%]"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent opacity-90" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1.5 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm tracking-[0.2em] uppercase mb-6 shadow-xl"
                    >
                        <span>{t('about_hero.badge')}</span>
                    </motion.span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
                        {t('about_hero.title')}
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto drop-shadow-lg font-light px-4 md:px-0">
                        {t('about_hero.description')}
                    </p>
                </motion.div>
            </div>

        </section>
    );
};

export default memo(AboutHero);