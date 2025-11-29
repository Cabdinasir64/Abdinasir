"use client";
import React, { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { successToast, errorToast } from "@/components/ui/Toaster";
import { FaMapMarkerAlt, FaEnvelope, FaPaperPlane, FaUser, FaRegCommentDots } from "react-icons/fa";

const Contact = () => {
    const { t } = useTranslation();
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    return (
        <section className="py-24 bg-surface-50 dark:bg-surface-950 relative overflow-hidden" id="contact" dir={isRTL ? 'rtl' : 'ltr'}>

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase text-xs mb-2 block"
                    >
                        <span >{t('nav.contact')}</span>
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold text-surface-900 dark:text-white mb-4"
                    >
                        <span >{t('contact.title')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-surface-600 dark:text-surface-400"
                    >
                        <span >{t('contact.subtitle')}</span>
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    <ContactInfo isRTL={isRTL} t={t} />
                    <ContactForm isRTL={isRTL} t={t} />
                </div>
            </div>
        </section>
    );
};

const ContactInfo = memo(({ isRTL, t }: { isRTL: boolean, t: any }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
        >

            <div className="bg-white dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-lg transition-all group flex items-center gap-5">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 text-2xl group-hover:scale-110 transition-transform shadow-inner">
                    <FaEnvelope />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{t('contact.info.email')}</h3>
                    <p className="text-surface-500 text-sm font-medium">abdinasirahmedbashir@gmail.com</p>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-900 p-6 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-lg transition-all group flex items-center gap-5">
                <div className="w-14 h-14 bg-secondary-100 dark:bg-secondary-900/30 rounded-2xl flex items-center justify-center text-secondary-600 text-2xl group-hover:scale-110 transition-transform shadow-inner">
                    <FaMapMarkerAlt />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{t('contact.info.location')}</h3>
                    <p className="text-surface-500 text-sm font-medium">Mogadishu, Somalia</p>
                </div>
            </div>

            <div className="h-48 rounded-[2rem] overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 animate-gradient-xy" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white z-10"
                >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/30">
                        <FaPaperPlane />
                    </div>
                    <p className="mt-3 font-bold tracking-widest text-xs uppercase opacity-90">Ready to Start?</p>
                </motion.div>

                <div className="absolute top-4 right-4 w-3 h-3 bg-white/40 rounded-full animate-ping" />
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
            </div>

        </motion.div>
    );
});
ContactInfo.displayName = "ContactInfo";

const ContactForm = memo(({ isRTL, t }: { isRTL: boolean, t: any }) => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        setErrors(prev => {
            if (prev[name as keyof typeof prev]) {
                return { ...prev, [name]: "" };
            }
            return prev;
        });
    }, []);

    const validate = useCallback(() => {
        let isValid = true;
        const newErrors = { name: "", email: "", message: "" };

        if (!formData.name.trim()) { newErrors.name = t('contact.errors.required'); isValid = false; }
        if (!formData.email.trim()) { newErrors.email = t('contact.errors.required'); isValid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = t('contact.errors.email_invalid'); isValid = false; }
        if (!formData.message.trim()) { newErrors.message = t('contact.errors.required'); isValid = false; }

        setErrors(newErrors);
        return isValid;
    }, [formData, t]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL
            const res = await fetch(`${baseUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed");
            successToast(t('contact.errors.success'));
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            errorToast(t('contact.errors.failed'));
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validate, t]);

    return (
        <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-white dark:bg-surface-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-surface-200 dark:border-surface-800 relative"
        >

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full -mr-px -mt-px pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                        <label className="text-sm font-bold text-surface-900 dark:text-white ml-1 flex items-center gap-2">
                            <FaUser className="text-primary-500" /> <span >{t('contact.form.name_label')}</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('contact.form.name_placeholder')}
                            className={`w-full px-6 py-4 rounded-xl bg-surface-50 dark:bg-surface-950 border outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-surface-200 dark:border-surface-800 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-sm font-bold text-surface-900 dark:text-white ml-1 flex items-center gap-2">
                            <FaEnvelope className="text-primary-500" /> <span >{t('contact.form.email_label')}</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('contact.form.email_placeholder')}
                            className={`w-full px-6 py-4 rounded-xl bg-surface-50 dark:bg-surface-950 border outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-surface-200 dark:border-surface-800 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'}`}
                            dir="ltr"
                        />
                        {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email}</p>}
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-surface-900 dark:text-white ml-1 flex items-center gap-2">
                        <FaRegCommentDots className="text-primary-500" /> <span >{t('contact.form.message_label')}</span>
                    </label>
                    <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form.message_placeholder')}
                        className={`w-full px-6 py-4 rounded-xl bg-surface-50 dark:bg-surface-950 border outline-none focus:ring-2 transition-all resize-none ${errors.message ? 'border-red-500 focus:ring-red-200' : 'border-surface-200 dark:border-surface-800 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs ml-1 font-medium">{errors.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg hover:shadow-primary-500/30 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span >{t('contact.form.submit')}</span>
                            <FaPaperPlane className={`group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
});
ContactForm.displayName = "ContactForm";

export default Contact;