"use client";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

interface WorkflowCardProps {
  step: { id: string; icon: string };
  index: number;
  isEven: boolean;
  isRTL: boolean;
}

const WorkflowCard = ({ step, index, isEven, isRTL }: WorkflowCardProps) => {
  const { t } = useTranslation();

  const showArrowRight = isRTL ? !isEven : isEven;
  const showArrowLeft = isRTL ? isEven : !isEven;

  return (
    <div
      className={`relative group p-8 bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30 transition-all duration-500 overflow-hidden text-start`}
    >

      <div
        className={`absolute -top-6 text-[8rem] font-black text-surface-100 dark:text-surface-800/50 opacity-50 pointer-events-none select-none leading-none z-0 
        ${isRTL ? 'left-4' : 'right-4'}`}
      >
        0{index + 1}
      </div>

      <div className="relative z-10">
        <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-3xl shadow-inner flex-shrink-0">
            {step.icon}
          </span>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">
            {t(`workflow.steps.${step.id}.title`)}
          </h3>
        </div>

        <p className="text-surface-600 dark:text-surface-400 leading-relaxed text-base">
          {t(`workflow.steps.${step.id}.desc`)}
        </p>
      </div>
      {showArrowRight && (
        <div className="hidden md:block absolute top-1/2 -right-2.5 w-5 h-5 bg-white dark:bg-surface-900 border-t border-r border-surface-200 dark:border-surface-800 transform rotate-45" />
      )}

      {showArrowLeft && (
        <div className="hidden md:block absolute top-1/2 -left-2.5 w-5 h-5 bg-white dark:bg-surface-900 border-b border-l border-surface-200 dark:border-surface-800 transform rotate-45" />
      )}

    </div>
  );
};

export default memo(WorkflowCard);