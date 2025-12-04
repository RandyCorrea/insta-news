import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { PostCard } from '@/components/ui/PostCard';
import postsData from '@/data/posts.json';
import { Post } from '@/lib/types';

export default function Home() {
  const posts: Post[] = (postsData as Post[])
    .filter(post => new Date(post.createdAt) <= new Date()) // Filter future posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort new to old

  return (
    <MobileContainer>
      <Header />
      <main className="pb-16">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
      <BottomNav />
    </MobileContainer>
  );
}
