// Main App JavaScript
let posts = [];
let likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

// Load posts from JSON
async function loadPosts() {
    try {
        const response = await fetch('data/posts.json');
        posts = await response.json();

        // Filter future posts and sort by date
        const now = new Date();
        posts = posts
            .filter(post => new Date(post.createdAt) <= now)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        renderFeed();
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Render feed
function renderFeed() {
    const feed = document.getElementById('feed');
    if (!feed) return;

    feed.innerHTML = posts.map(post => createPostCard(post)).join('');
    lucide.createIcons();
}

// Create post card HTML
function createPostCard(post) {
    const isLiked = likedPosts.includes(post.id);
    const timeAgo = getTimeAgo(post.createdAt);

    return `
        <article class="post-card bg-white dark:bg-black mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <!-- Header -->
            <div class="flex items-center justify-between px-3 py-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                        <div class="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
                            <div class="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800"></div>
                        </div>
                    </div>
                    <span class="font-semibold text-sm">${post.author}</span>
                </div>
                <button>
                    <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Media -->
            <div class="relative aspect-[4/5] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover">
                ${post.videoUrl ? '<div class="absolute inset-0 flex items-center justify-center bg-black/20"><span class="text-white font-bold">VIDEO</span></div>' : ''}
            </div>

            <!-- Actions -->
            <div class="px-3 py-3">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-4">
                        <button onclick="toggleLike('${post.id}')" id="like-${post.id}">
                            <i data-lucide="heart" class="w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}"></i>
                        </button>
                        <a href="post.html?slug=${post.slug}">
                            <i data-lucide="message-circle" class="w-6 h-6"></i>
                        </a>
                        <button onclick="openShareModal('${post.slug}', '${post.title}')">
                            <i data-lucide="send" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <button>
                        <i data-lucide="bookmark" class="w-6 h-6"></i>
                    </button>
                </div>

                <div class="font-semibold text-sm mb-1" id="likes-${post.id}">${post.likes + (isLiked ? 1 : 0)} Me gusta</div>
                
                <div class="text-sm mb-1">
                    <span class="font-semibold mr-2">${post.author}</span>
                    <span>${post.title}</span>
                </div>
                
                <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    ${post.description}
                </div>

                <a href="post.html?slug=${post.slug}" class="text-xs text-gray-400 dark:text-gray-500 mt-1 block uppercase">
                    ${timeAgo}
                </a>
            </div>
        </article>
    `;
}

// Toggle like
function toggleLike(postId) {
    const index = likedPosts.indexOf(postId);
    const post = posts.find(p => p.id === postId);

    if (index > -1) {
        likedPosts.splice(index, 1);
    } else {
        likedPosts.push(postId);
    }

    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

    // Update UI
    const likeBtn = document.getElementById(`like-${postId}`);
    const likesCount = document.getElementById(`likes-${postId}`);
    const icon = likeBtn.querySelector('i');

    if (likedPosts.includes(postId)) {
        icon.classList.add('fill-red-500', 'text-red-500', 'heart-liked');
        likesCount.textContent = `${post.likes + 1} Me gusta`;
    } else {
        icon.classList.remove('fill-red-500', 'text-red-500', 'heart-liked');
        likesCount.textContent = `${post.likes} Me gusta`;
    }

    setTimeout(() => icon.classList.remove('heart-liked'), 300);
}

// Share functionality
function openShareModal(slug, title) {
    const shareUrl = `${window.location.origin}/insta-news/post.html?slug=${slug}`;
    const modal = document.getElementById('shareModal');
    const options = document.getElementById('shareOptions');

    if (navigator.share) {
        navigator.share({
            title: title,
            url: shareUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        options.innerHTML = `
            <a href="https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}" target="_blank" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">W</div>
                <span class="text-xs">WhatsApp</span>
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}" target="_blank" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                    <i data-lucide="twitter" class="w-5 h-5"></i>
                </div>
                <span class="text-xs">Twitter</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <i data-lucide="facebook" class="w-5 h-5"></i>
                </div>
                <span class="text-xs">Facebook</span>
            </a>
            <button onclick="copyLink('${shareUrl}')" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <i data-lucide="link" class="w-5 h-5"></i>
                </div>
                <span class="text-xs">Copiar</span>
            </button>
        `;
        modal.classList.remove('hidden');
        lucide.createIcons();
    }
}

function closeShareModal() {
    document.getElementById('shareModal').classList.add('hidden');
}

function copyLink(url) {
    navigator.clipboard.writeText(url);
    alert('Enlace copiado al portapapeles');
    closeShareModal();
}

// Load single post
async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data/posts.json');
        posts = await response.json();
        const post = posts.find(p => p.slug === slug);

        if (!post) {
            window.location.href = 'index.html';
            return;
        }

        // Update meta tags
        document.getElementById('post-title').textContent = `${post.title} - InstaNews`;
        document.getElementById('post-description').content = post.description;
        document.getElementById('og-title').content = post.title;
        document.getElementById('og-description').content = post.description;
        document.getElementById('og-image').content = post.imageUrl;
        document.getElementById('tw-title').content = post.title;
        document.getElementById('tw-description').content = post.description;
        document.getElementById('tw-image').content = post.imageUrl;

        // Render post
        const content = document.getElementById('postContent');
        content.innerHTML = `
            <div class="mb-4">${createPostCard(post)}</div>
            <div class="px-4 pb-8">
                <h1 class="text-2xl font-bold mb-4">${post.title}</h1>
                <div class="prose dark:prose-invert max-w-none">
                    <p>${post.content}</p>
                </div>
            </div>
        `;

        lucide.createIcons();
    } catch (error) {
        console.error('Error loading post:', error);
        window.location.href = 'index.html';
    }
}

// Time ago helper
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'ahora mismo';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} d`;
    return `hace ${Math.floor(seconds / 604800)} sem`;
}

// Initialize
if (document.getElementById('feed')) {
    loadPosts();
}
