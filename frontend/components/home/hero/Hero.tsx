"use client";
import React from "react";
import { useLanguageStore } from "@/stores/languageStore";
import Background from "./Background";
import HeroText from "./HeroText";
import HeroImage from "./HeroImage";

const Hero = () => {
    const { currentLang } = useLanguageStore();
    const isRTL = currentLang === 'ar';

    const START_DELAY = 2.2;

    return (
        <section
            className="relative min-h-screen flex items-center pt-28 pb-10 lg:pt-[85px] overflow-hidden bg-surface-50/50"
            dir="ltr"
        >
            <Background />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`
          flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-10
          ${isRTL ? 'lg:flex-row-reverse' : ''} 
        `}>

                    <div className="w-full lg:w-1/2 flex justify-center lg:block">
                        <HeroText delay={START_DELAY} isRTL={isRTL} />
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className={`w-full flex ${isRTL ? 'lg:justify-start' : 'lg:justify-end'} justify-center`}>
                            <HeroImage delay={START_DELAY + 0.4} isRTL={isRTL} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default React.memo(Hero);