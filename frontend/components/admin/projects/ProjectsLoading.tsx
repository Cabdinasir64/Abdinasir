export default function ProjectsLoading() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="w-32 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="w-32 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                ))}
            </div>
            <div className="flex justify-center items-center space-x-2 pt-8">
                <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
            </div>
        </div>
    );
}

function ProjectCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300 relative">
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-400 rounded-full"></div>
            </div>

            <div className="p-6">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-14"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
}
