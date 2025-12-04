import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center">
            <div className={cn(
                "w-full max-w-md bg-white dark:bg-black min-h-screen shadow-sm border-x border-gray-200 dark:border-gray-800 relative",
                className
            )}>
                {children}
            </div>
        </div>
    );
}
