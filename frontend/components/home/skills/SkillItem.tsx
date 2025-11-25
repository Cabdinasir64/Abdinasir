"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { getSkillPercentage } from "@/utils/skillHelpers";
import { Skill } from "@/types/skill";

interface SkillProps {
  skill: Skill;
  isActive: boolean;
  onClick: () => void;
  isRTL: boolean;
}

const SkillItem = ({ skill, isActive, onClick, isRTL }: SkillProps) => {
  const percentage = getSkillPercentage(skill.level);

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 mr-4 last:mr-0
        ${isActive
          ? 'w-[300px] bg-gradient-to-br from-white to-surface-50 dark:from-surface-900 dark:to-surface-800 border-primary-500 shadow-2xl shadow-primary-500/20 z-10 opacity-100 ring-2 ring-primary-500/20'
          : 'w-[85px] bg-surface-50/80 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 opacity-70 hover:opacity-100 hover:scale-105 backdrop-blur-sm hover:border-primary-300 dark:hover:border-primary-600'
        }
        h-[95px] flex items-center
      `}
      whileHover={{
        scale: isActive ? 1 : 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className={`w-full flex items-center px-4 gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>

        <motion.div
          layout="position"
          className={`flex-shrink-0 relative rounded-xl overflow-hidden p-2 transition-all duration-300
            ${isActive
              ? 'w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/30 shadow-inner'
              : 'w-10 h-10 bg-transparent grayscale hover:grayscale-0'
            }
          `}
        >
          <Image
            src={skill.skillImage}
            alt={skill.name}
            fill
            className="object-contain p-1"
          />
        </motion.div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="flex-1 min-w-0 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-surface-900 dark:text-white text-base leading-tight truncate">
                {skill.name}
              </h3>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] text-center"
              >
                {percentage}%
              </motion.span>
            </div>

            <p className="text-xs text-surface-500 dark:text-surface-400 font-medium capitalize">
              {skill.level}
            </p>

            <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full relative"
              >
                <motion.div
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/40"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillItem;