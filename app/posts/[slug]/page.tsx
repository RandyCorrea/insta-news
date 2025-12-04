import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { PostCard } from '@/components/ui/PostCard';
import postsData from '@/data/posts.json';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts: Post[] = postsData as Post[];
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = (postsData as Post[]).find((p) => p.slug === slug);

    if (!post) {
        return {
            title: 'Post no encontrado',
        };
    }

    return {
        title: `${post.title} | InstaNews`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: post.imageUrl,
                    width: 1080,
                    height: 1080,
                    alt: post.title,
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [post.imageUrl],
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = (postsData as Post[]).find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <MobileContainer>
            <Header />
            <main className="pb-16 pt-4">
                <div className="mb-4">
                    <PostCard post={post} />
                </div>
                <div className="px-4 pb-8">
                    <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                    <div className="prose dark:prose-invert max-w-none">
                        <p>{post.content}</p>
                    </div>
                </div>
            </main>
            <BottomNav />
        </MobileContainer>
    );
}
