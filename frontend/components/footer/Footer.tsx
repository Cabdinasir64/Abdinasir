"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

const Footer = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';
    const currentYear = new Date().getFullYear();

    const links = [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.about'), href: 'about' },
        { name: t('nav.skills'), href: 'skills' },
        { name: t('nav.projects'), href: 'projects' },
    ];

    const socials = [
        {
            name: "GitHub",
            url: "https://github.com/Cabdinasir64",
            path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/abdinasir-ahmed-7970b837a",
            path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        },
        {
            name: "Facebook",
            url: "https://www.facebook.com/profile.php?id=61555642311856",
            path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"
        }
    ];

    return (
        <footer className="bg-[#0B0F19] text-gray-300 border-t border-white/10 relative overflow-hidden">

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />

            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-900/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-900/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">

                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>

                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-900/20 group-hover:scale-105 transition-transform duration-300">
                                A
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Abdinasir<span className="text-primary-500">.</span></span>
                        </Link>
                        <p suppressHydrationWarning className="text-sm leading-relaxed text-gray-400 max-w-xs">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">{t('footer.links_title')}</h3>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 w-fit"
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary-500 transition-colors ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">{t('footer.contact_title')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 group">
                                <div className="p-2 bg-white/5 rounded-lg text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <a href="mailto:abdinasir@example.com" className="text-gray-400 hover:text-white transition-colors mt-1">
                                    abdinasirahmedbashir@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="p-2 bg-white/5 rounded-lg text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-gray-400 mt-1">Mogadishu, Somalia</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">{t('footer.socials_title')}</h3>
                        <div className="flex gap-3">
                            {socials.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.path} />
                                    </svg>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

                    <p className={`${isRTL ? 'text-right' : 'text-left'}`}>
                        &copy; {currentYear} <span className="text-gray-200 font-medium">Abdinasir</span>. {t('footer.rights')}
                    </p>

                    <p className="flex items-center gap-1.5">
                        {t('footer.built_with')}
                        <span className="text-red-500 animate-pulse">❤</span>
                    </p>

                </div>

            </div>
        </footer>
    );
};

export default Footer;