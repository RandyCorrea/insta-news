'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Link as LinkIcon, Twitter, Facebook } from 'lucide-react';
import { Post } from '@/lib/types';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/posts/${post.slug}` : '';

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.description,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            setShowShareMenu(true);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Enlace copiado al portapapeles');
        setShowShareMenu(false);
    };

    return (
        <article className="bg-white dark:bg-black mb-4 border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
                            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800" />
                        </div>
                    </div>
                    <span className="font-semibold text-sm">{post.author}</span>
                </div>
                <button>
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Media */}
            <div className="relative aspect-[4/5] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                {post.videoUrl ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {/* Video placeholder or embed */}
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="text-white font-bold">VIDEO</span>
                        </div>
                    </div>
                ) : (
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>

            {/* Actions */}
            <div className="px-3 py-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsLiked(!isLiked)}>
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <Link href={`/posts/${post.slug}`}>
                            <MessageCircle className="w-6 h-6" />
                        </Link>
                        <button onClick={handleShare}>
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                    <button>
                        <Bookmark className="w-6 h-6" />
                    </button>
                </div>

                <div className="font-semibold text-sm mb-1">{post.likes + (isLiked ? 1 : 0)} Me gusta</div>

                <div className="text-sm mb-1">
                    <span className="font-semibold mr-2">{post.author}</span>
                    <span>{post.title}</span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {post.description}
                </div>

                <Link href={`/posts/${post.slug}`} className="text-xs text-gray-400 dark:text-gray-500 mt-1 block uppercase">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
                </Link>
            </div>

            {/* Share Menu Fallback */}
            {showShareMenu && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowShareMenu(false)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-xs p-4 space-y-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-center font-semibold border-b pb-2 dark:border-gray-700">Compartir en</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    W
                                </div>
                                <span className="text-xs">WhatsApp</span>
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <span className="text-xs">Twitter</span>
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    <Facebook className="w-5 h-5" />
                                </div>
                                <span className="text-xs">Facebook</span>
                            </a>
                            <button onClick={copyLink} className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <span className="text-xs">Copiar</span>
                            </button>
                        </div>
                        <button onClick={() => setShowShareMenu(false)} className="w-full py-2 text-red-500 font-semibold border-t dark:border-gray-700 pt-2">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}
