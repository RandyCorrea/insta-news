import Link from 'next/link';
import { Bell, Heart } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tighter italic">
                InstaNews
            </Link>
            <div className="flex items-center gap-4">
                <button className="text-gray-900 dark:text-white">
                    <Heart className="w-6 h-6" />
                </button>
                <button className="text-gray-900 dark:text-white">
                    <Bell className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
