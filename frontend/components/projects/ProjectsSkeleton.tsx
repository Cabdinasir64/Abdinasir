"use client";
import React, { memo } from "react";

const SKELETON_ITEMS = Array.from({ length: 6 });

const ProjectsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {SKELETON_ITEMS.map((_, i) => (
        <div key={i} className="bg-white dark:bg-surface-900 rounded-3xl overflow-hidden border border-surface-200 dark:border-surface-800 h-[450px] animate-pulse flex flex-col">
          <div className="h-56 bg-surface-200 dark:bg-surface-800 w-full" />

          <div className="p-6 flex flex-col flex-1">
            <div className="h-6 w-3/4 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
            <div className="flex gap-4 mb-6">
              <div className="h-4 w-12 bg-surface-100 dark:bg-surface-800 rounded" />
              <div className="h-4 w-12 bg-surface-100 dark:bg-surface-800 rounded" />
              <div className="h-4 w-12 bg-surface-100 dark:bg-surface-800 rounded" />
            </div>
            <div className="h-4 w-full bg-surface-100 dark:bg-surface-800 rounded mb-2" />
            <div className="h-4 w-2/3 bg-surface-100 dark:bg-surface-800 rounded mb-auto" />

            <div className="h-12 w-full bg-surface-200 dark:bg-surface-800 rounded-xl mt-6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(ProjectsSkeleton);