export interface Post {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    videoUrl?: string;
    createdAt: string;
    author: string;
    likes: number;
}

export interface SiteConfig {
    title: string;
    description: string;
    url: string;
}
