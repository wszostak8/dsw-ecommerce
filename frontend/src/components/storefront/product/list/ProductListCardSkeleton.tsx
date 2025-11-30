export const ProductCardSkeleton = () => {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            <div className="aspect-w-3 aspect-h-4 bg-gray-200 dark:bg-neutral-700 sm:aspect-none sm:h-60 animate-pulse" />
            <div className="flex flex-1 flex-col space-y-2 p-4">
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
                <div className="flex flex-1 flex-col justify-end pt-4">
                    <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/4 animate-pulse" />
                </div>
            </div>
        </div>
    );
};