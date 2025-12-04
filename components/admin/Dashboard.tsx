'use client';

import { useState } from 'react';
import { Post } from '@/lib/types';
import postsData from '@/data/posts.json';
import { Plus, Download } from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
    const [posts, setPosts] = useState<Post[]>(postsData as Post[]);
    const [view, setView] = useState<'list' | 'create'>('list');
    const [newPost, setNewPost] = useState<Partial<Post>>({
        title: '',
        description: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        author: 'Admin',
        likes: 0,
    });
    const [scheduledDate, setScheduledDate] = useState('');

    const handleImagePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    // In a real app, upload this blob to a server.
                    // Here we will convert to base64 for demo purposes, 
                    // BUT warn the user that base64 is heavy for JSON.
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (typeof event.target?.result === 'string') {
                            setNewPost({ ...newPost, imageUrl: event.target.result });
                            alert('Imagen pegada. Nota: Las imágenes en Base64 son pesadas. Se recomienda usar URLs externas para producción.');
                        }
                    };
                    reader.readAsDataURL(blob);
                }
            }
        }
    };

    const handleVideoUrlChange = (url: string) => {
        // Try to extract thumbnail from YouTube
        let thumb = '';
        const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch && ytMatch[1]) {
            thumb = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
        }

        setNewPost(prev => ({
            ...prev,
            videoUrl: url,
            imageUrl: thumb || prev.imageUrl // Use YT thumb if found, else keep existing
        }));
    };

    const handleSave = () => {
        const id = Date.now().toString();
        const slug = newPost.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sin-titulo';

        const post: Post = {
            id,
            slug,
            title: newPost.title || 'Sin Título',
            description: newPost.description || '',
            content: newPost.content || '',
            imageUrl: newPost.imageUrl || 'https://via.placeholder.com/1080',
            videoUrl: newPost.videoUrl,
            createdAt: scheduledDate || new Date().toISOString(),
            author: newPost.author || 'Admin',
            likes: 0,
        };

        const updatedPosts = [post, ...posts];
        setPosts(updatedPosts);
        setView('list');

        // Reset form
        setNewPost({ title: '', description: '', content: '', imageUrl: '', videoUrl: '', author: 'Admin', likes: 0 });
        setScheduledDate('');
    };

    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "posts.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="pb-20">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Panel de Noticias</h1>
                <div className="flex gap-2">
                    <button
                        onClick={downloadJson}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        title="Descargar JSON actualizado"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setView('create')}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {view === 'list' ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="flex gap-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden relative shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{post.title}</h3>
                                <p className="text-xs text-gray-500">{format(new Date(post.createdAt), 'dd MMM yyyy')}</p>
                                <p className="text-xs text-gray-400 mt-1 truncate">{post.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Título</label>
                        <input
                            type="text"
                            value={newPost.title}
                            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Título de la noticia"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción Corta</label>
                        <textarea
                            value={newPost.description}
                            onChange={e => setNewPost({ ...newPost, description: e.target.value })}
                            className="w-full p-2 border rounded-md bg-transparent h-20"
                            placeholder="Resumen para el feed..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contenido Completo</label>
                        <textarea
                            value={newPost.content}
                            onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                            className="w-full p-2 border rounded-md bg-transparent h-32"
                            placeholder="Texto completo de la noticia..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagen (URL o Pegar)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPost.imageUrl}
                                onChange={e => setNewPost({ ...newPost, imageUrl: e.target.value })}
                                onPaste={handleImagePaste}
                                className="w-full p-2 border rounded-md bg-transparent"
                                placeholder="https://... (o Ctrl+V para pegar imagen)"
                            />
                        </div>
                        {newPost.imageUrl && (
                            <div className="w-full h-40 bg-gray-100 relative rounded-md overflow-hidden mt-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={newPost.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Video URL (YouTube/Vimeo)</label>
                        <input
                            type="text"
                            value={newPost.videoUrl}
                            onChange={e => handleVideoUrlChange(e.target.value)}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="https://youtube.com/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Programar Publicación</label>
                        <input
                            type="datetime-local"
                            value={scheduledDate}
                            onChange={e => setScheduledDate(e.target.value)}
                            className="w-full p-2 border rounded-md bg-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setView('list')}
                            className="flex-1 py-2 border border-gray-300 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-md font-semibold"
                        >
                            Guardar Noticia
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
