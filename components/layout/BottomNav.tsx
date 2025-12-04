import Link from 'next/link';
import { Home, Search, PlusSquare, User, Lock } from 'lucide-react';

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 h-12 flex items-center justify-around z-50">
            <Link href="/" className="p-2 text-gray-900 dark:text-white">
                <Home className="w-6 h-6" />
            </Link>
            <button className="p-2 text-gray-500 dark:text-gray-400">
                <Search className="w-6 h-6" />
            </button>
            <Link href="/admin-secret-access" className="p-2 text-gray-900 dark:text-white">
                <PlusSquare className="w-6 h-6" />
            </Link>
            <button className="p-2 text-gray-500 dark:text-gray-400">
                <User className="w-6 h-6" />
            </button>
        </nav>
    );
}
