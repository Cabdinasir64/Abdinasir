const SkillsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-4 h-[280px] border border-surface-200 dark:border-surface-700 flex flex-col">
          <div className="w-full h-32 bg-surface-200 dark:bg-surface-700 rounded-xl mb-4" />
          <div className="h-4 w-3/4 bg-surface-200 dark:bg-surface-700 rounded mb-2" />
          <div className="h-3 w-1/2 bg-surface-200 dark:bg-surface-700 rounded mb-auto" />
          <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded mt-4" />
        </div>
      ))}
    </div>
  );
};

export default SkillsSkeleton;