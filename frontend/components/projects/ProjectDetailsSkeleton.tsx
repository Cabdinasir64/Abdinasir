"use client";
import React, { memo } from "react";

const ProjectDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20 animate-pulse">

            <div className="relative h-[50vh] md:h-[60vh] w-full bg-surface-200 dark:bg-surface-800">
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
                    <div className="h-6 w-24 bg-surface-300 dark:bg-surface-700 rounded-full mb-4" />
                    <div className="h-10 md:h-16 w-3/4 bg-surface-300 dark:bg-surface-700 rounded-xl mb-4" />

                    <div className="flex gap-6">
                        <div className="h-5 w-20 bg-surface-300 dark:bg-surface-700 rounded-md" />
                        <div className="h-5 w-20 bg-surface-300 dark:bg-surface-700 rounded-md" />
                        <div className="h-8 w-24 bg-surface-300 dark:bg-surface-700 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-2 space-y-12">

                    <div className="bg-white dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800">
                        <div className="h-8 w-40 bg-surface-200 dark:bg-surface-800 rounded-lg mb-6" />
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-surface-100 dark:bg-surface-800 rounded" />
                            <div className="h-4 w-full bg-surface-100 dark:bg-surface-800 rounded" />
                            <div className="h-4 w-2/3 bg-surface-100 dark:bg-surface-800 rounded" />
                        </div>
                    </div>

                    <div>
                        <div className="h-8 w-32 bg-surface-200 dark:bg-surface-800 rounded-lg mb-6" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="h-32 bg-surface-200 dark:bg-surface-800 rounded-xl" />
                            <div className="h-32 bg-surface-200 dark:bg-surface-800 rounded-xl" />
                            <div className="h-32 bg-surface-200 dark:bg-surface-800 rounded-xl" />
                        </div>                    </div>
                </div>

                <div className="space-y-8">

                    <div className="bg-white dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800">
                        <div className="h-6 w-32 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
                        <div className="flex flex-wrap gap-2">
                            <div className="h-8 w-16 bg-surface-100 dark:bg-surface-800 rounded-lg" />
                            <div className="h-8 w-20 bg-surface-100 dark:bg-surface-800 rounded-lg" />
                            <div className="h-8 w-14 bg-surface-100 dark:bg-surface-800 rounded-lg" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-900 p-8 rounded-3xl border border-surface-200 dark:border-surface-800">
                        <div className="h-6 w-32 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
                        <div className="h-12 w-full bg-surface-100 dark:bg-surface-800 rounded-xl" />
                    </div>

                    <div className="bg-surface-200 dark:bg-surface-800 h-40 rounded-3xl" />
                </div>

            </div>
        </div>
    );
};

export default memo(ProjectDetailsSkeleton);