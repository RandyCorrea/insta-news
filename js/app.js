// Main App JavaScript
let posts = [];
let likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
let savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');

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
    const isSaved = savedPosts.includes(post.id);
    const timeAgo = getTimeAgo(post.createdAt);

    // Truncate description for feed
    const shortDesc = post.description.length > 100
        ? post.description.substring(0, 100) + '...'
        : post.description;

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
                ${post.videoUrl ? `
                    <iframe 
                        src="${getEmbedUrl(post.videoUrl)}" 
                        class="w-full h-full" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                ` : `
                    <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover">
                `}
            </div>

            <!-- Actions -->
            <div class="px-3 py-3">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-4">
                        <button onclick="toggleLike('${post.id}')" id="like-${post.id}">
                            <i data-lucide="heart" class="w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}"></i>
                        </button>
                        <button onclick="openShareModal('${post.slug}', '${post.title.replace(/'/g, "\\'")}')">
                            <i data-lucide="send" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <button onclick="toggleSave('${post.id}')" id="save-${post.id}">
                        <i data-lucide="bookmark" class="w-6 h-6 ${isSaved ? 'fill-black dark:fill-white' : ''}"></i>
                    </button>
                </div>

                <div class="font-semibold text-sm mb-1" id="likes-${post.id}">${post.likes + (isLiked ? 1 : 0)} Me gusta</div>
                
                <div class="text-sm mb-1">
                    <span class="font-semibold mr-2">${post.author}</span>
                    <span>${post.title}</span>
                </div>
                
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    ${shortDesc}
                    ${post.description.length > 100 ? `<a href="post.html?slug=${post.slug}" class="text-gray-400 font-medium">Ver más</a>` : ''}
                </div>

                <a href="post.html?slug=${post.slug}" class="text-xs text-gray-400 dark:text-gray-500 mt-1 block uppercase">
                    ${timeAgo}
                </a>
            </div>
        </article>
    `;
}

// Get embed URL for videos
function getEmbedUrl(url) {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Rumble
    const rumbleMatch = url.match(/rumble\.com\/([^\/]+)/);
    if (rumbleMatch && rumbleMatch[1]) {
        return `https://rumble.com/embed/${rumbleMatch[1]}`;
    }

    return url;
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

// Toggle save
function toggleSave(postId) {
    const index = savedPosts.indexOf(postId);
    const saveBtn = document.getElementById(`save-${postId}`);
    const icon = saveBtn.querySelector('i');

    if (index > -1) {
        savedPosts.splice(index, 1);
        icon.classList.remove('fill-black', 'dark:fill-white');
    } else {
        savedPosts.push(postId);
        icon.classList.add('fill-black', 'dark:fill-white');
    }

    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
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

// Settings modal
function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

// Profile modal
function openProfile() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('hidden');
    renderProfilePosts('liked');
}

function closeProfile() {
    document.getElementById('profileModal').classList.add('hidden');
}

function switchProfileTab(tab) {
    const tabLiked = document.getElementById('tabLiked');
    const tabSaved = document.getElementById('tabSaved');

    if (tab === 'liked') {
        tabLiked.classList.add('border-black', 'dark:border-white');
        tabLiked.classList.remove('text-gray-400', 'border-transparent');
        tabSaved.classList.remove('border-black', 'dark:border-white');
        tabSaved.classList.add('text-gray-400', 'border-transparent');
    } else {
        tabSaved.classList.add('border-black', 'dark:border-white');
        tabSaved.classList.remove('text-gray-400', 'border-transparent');
        tabLiked.classList.remove('border-black', 'dark:border-white');
        tabLiked.classList.add('text-gray-400', 'border-transparent');
    }

    renderProfilePosts(tab);
}

function renderProfilePosts(tab) {
    const likedContainer = document.getElementById('likedPosts');
    const savedContainer = document.getElementById('savedPosts');

    if (tab === 'liked') {
        likedContainer.classList.remove('hidden');
        savedContainer.classList.add('hidden');

        const likedPostsData = posts.filter(p => likedPosts.includes(p.id));
        likedContainer.innerHTML = likedPostsData.length > 0
            ? likedPostsData.map(post => `
                <a href="post.html?slug=${post.slug}" class="aspect-square bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover">
                </a>
            `).join('')
            : '<p class="col-span-3 text-center text-gray-500 py-8">No tienes likes aún</p>';
    } else {
        savedContainer.classList.remove('hidden');
        likedContainer.classList.add('hidden');

        const savedPostsData = posts.filter(p => savedPosts.includes(p.id));
        savedContainer.innerHTML = savedPostsData.length > 0
            ? savedPostsData.map(post => `
                <a href="post.html?slug=${post.slug}" class="aspect-square bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-full object-cover">
                </a>
            `).join('')
            : '<p class="col-span-3 text-center text-gray-500 py-8">No tienes guardados aún</p>';
    }
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
                <div class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
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
