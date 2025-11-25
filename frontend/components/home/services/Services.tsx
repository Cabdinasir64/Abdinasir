"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import ServiceCard from "./ServiceCard";
import { Icons } from "./ServiceIcons";

const Services = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const servicesList = [
        { key: "web_dev", icon: Icons.WebDev },
        { key: "ui_ux", icon: Icons.Design },
        { key: "mobile", icon: Icons.Mobile },
        { key: "security", icon: Icons.Security },
        { key: "api", icon: Icons.Api },
        { key: "deployment", icon: Icons.Deploy },
    ];

    return (
        <section className="py-24 bg-surface-50 dark:bg-surface-950 relative overflow-hidden" id="services">

            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary-100/30 dark:bg-secondary-900/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className={`mb-16 max-w-3xl ${isRTL ? 'mr-auto text-right' : 'ml-auto text-left'} md:mx-auto md:text-center`}>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-3 border border-primary-100 dark:border-primary-800"
                    >
                        {t('services.title')}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-surface-900 dark:text-white mb-6"
                    >
                        {t('services.title')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-surface-600 dark:text-surface-400"
                    >
                        {t('services.subtitle')}
                    </motion.p>
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {servicesList.map((service, index) => (
                        <ServiceCard
                            key={service.key}
                            index={index}
                            title={t(`services.items.${service.key}.title`)}
                            description={t(`services.items.${service.key}.desc`)}
                            icon={service.icon}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;