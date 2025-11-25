export const getSkillPercentage = (level: string): number => {
    const normalizedLevel = level.toLowerCase().trim();

    const levels: Record<string, number> = {
        'beginner': 30,
        'intermediate': 60,
        'advanced': 85,
        'expert': 100,

        'bilow': 30,
        'dhexdhexaad': 60,
        'sare': 85,
        'khabiir': 100,

        'مبتدأ': 30,
        'متوسط': 60,
        'متقدم': 85,
        'خبير': 100
    };

    return levels[normalizedLevel] || 50;
};

export const getLevelColor = (percentage: number) => {
    if (percentage <= 30) return "bg-blue-400";
    if (percentage <= 60) return "bg-primary-500";
    if (percentage <= 85) return "bg-purple-500";
    return "bg-green-500";
};