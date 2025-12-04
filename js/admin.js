// Admin Panel JavaScript
const ADMIN_PASSWORD = 'admin';
let posts = [];
let isAuthenticated = false;
let editingPostId = null;

// Check authentication on load
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

function checkAuth() {
    const session = sessionStorage.getItem('admin_session');
    const lockout = localStorage.getItem('admin_lockout');

    if (lockout) {
        const lockoutTime = parseInt(lockout);
        if (Date.now() < lockoutTime) {
            showLockout(lockoutTime);
            return;
        } else {
            localStorage.removeItem('admin_lockout');
            localStorage.removeItem('admin_attempts');
        }
    }

    if (session === 'true') {
        isAuthenticated = true;
        showDashboard();
    }
}

function showLockout(lockoutTime) {
    const lockoutMsg = document.getElementById('lockoutMessage');
    const lockoutText = document.getElementById('lockoutText');
    const loginForm = document.getElementById('loginForm');

    const date = new Date(lockoutTime).toLocaleDateString();
    lockoutText.textContent = `Inténtalo de nuevo después del ${date}.`;
    lockoutMsg.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const createBtn = document.getElementById('createBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const imageInput = document.getElementById('imageInput');
    const imageFileInput = document.getElementById('imageFileInput');
    const videoInput = document.getElementById('videoInput');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (createBtn) {
        createBtn.addEventListener('click', showCreateForm);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideCreateForm);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', savePost);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadJSON);
    }

    if (imageInput) {
        imageInput.addEventListener('input', handleImageInput);
        imageInput.addEventListener('paste', handleImagePaste);
    }

    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageFileUpload);
    }

    if (videoInput) {
        videoInput.addEventListener('input', handleVideoInput);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMessage');

    // Check if locked out
    const lockout = localStorage.getItem('admin_lockout');
    if (lockout && Date.now() < parseInt(lockout)) {
        return;
    }

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_session', 'true');
        localStorage.removeItem('admin_attempts');
        isAuthenticated = true;
        showDashboard();
    } else {
        let attempts = parseInt(localStorage.getItem('admin_attempts') || '0') + 1;
        localStorage.setItem('admin_attempts', attempts.toString());

        if (attempts >= 3) {
            const lockoutTime = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
            localStorage.setItem('admin_lockout', lockoutTime.toString());
            showLockout(lockoutTime);
            errorMsg.classList.add('hidden');
        } else {
            errorMsg.textContent = `Contraseña incorrecta. Intentos restantes: ${3 - attempts}`;
            errorMsg.classList.remove('hidden');
        }
    }
}

async function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');

    await loadPosts();
    renderPostsList();
    lucide.createIcons();
}

async function loadPosts() {
    try {
        const response = await fetch('data/posts.json');
        posts = await response.json();
    } catch (error) {
        console.error('Error loading posts:', error);
        posts = [];
    }
}

function renderPostsList() {
    const postsList = document.getElementById('postsList');

    if (posts.length === 0) {
        postsList.innerHTML = '<p class="text-gray-500 text-center py-8">No hay publicaciones aún</p>';
        return;
    }

    postsList.innerHTML = posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(post => `
            <div class="flex gap-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div class="w-16 h-16 bg-gray-200 rounded-md overflow-hidden relative shrink-0">
                    <img src="${post.imageUrl}" alt="" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold truncate">${post.title}</h3>
                    <p class="text-xs text-gray-500">${new Date(post.createdAt).toLocaleDateString()}</p>
                    <p class="text-xs text-gray-400 mt-1 truncate">${post.description}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <button onclick="editPost('${post.id}')" class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deletePost('${post.id}')" class="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `).join('');

    lucide.createIcons();
}

function showCreateForm() {
    editingPostId = null;
    document.getElementById('postsList').classList.add('hidden');
    document.getElementById('createForm').classList.remove('hidden');
    document.getElementById('formTitle').textContent = 'Nueva Noticia';
    clearForm();
}

function hideCreateForm() {
    document.getElementById('postsList').classList.remove('hidden');
    document.getElementById('createForm').classList.add('hidden');
    editingPostId = null;
    clearForm();
}

function clearForm() {
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('contentInput').value = '';
    document.getElementById('imageInput').value = '';
    document.getElementById('imageFileInput').value = '';
    document.getElementById('videoInput').value = '';
    document.getElementById('scheduleInput').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
}

function handleImageInput(e) {
    const url = e.target.value;
    if (url) {
        showImagePreview(url);
    }
}

function handleImagePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            if (blob) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    document.getElementById('imageInput').value = base64;
                    showImagePreview(base64);
                };
                reader.readAsDataURL(blob);
            }
        }
    }
}

function handleImageFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
    }

    // Save to images folder (simulated - in reality you'd upload to server or encode)
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()}`;
    const imagePath = `images/${filename}`;

    const reader = new FileReader();
    reader.onload = (event) => {
        // Use base64 for now (in production, upload to images/ folder via GitHub API or similar)
        const base64 = event.target.result;
        document.getElementById('imageInput').value = base64;
        showImagePreview(base64);
        alert('Imagen cargada. Recuerda descargar el JSON actualizado y subirlo a GitHub junto con la imagen en la carpeta /images/ si usas URL local.');
    };
    reader.readAsDataURL(file);
}

function showImagePreview(url) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = url;
    preview.classList.remove('hidden');
}

function handleVideoInput(e) {
    const url = e.target.value;
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);

    if (ytMatch && ytMatch[1]) {
        const thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
        document.getElementById('imageInput').value = thumbnail;
        showImagePreview(thumbnail);
    }
}

function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    editingPostId = postId;

    // Fill form with post data
    document.getElementById('titleInput').value = post.title;
    document.getElementById('descriptionInput').value = post.description;
    document.getElementById('contentInput').value = post.content;
    document.getElementById('imageInput').value = post.imageUrl;
    document.getElementById('videoInput').value = post.videoUrl || '';
    document.getElementById('scheduleInput').value = post.createdAt.replace('Z', '').slice(0, 16);

    if (post.imageUrl) {
        showImagePreview(post.imageUrl);
    }

    document.getElementById('formTitle').textContent = 'Editar Noticia';
    document.getElementById('postsList').classList.add('hidden');
    document.getElementById('createForm').classList.remove('hidden');
}

function deletePost(postId) {
    if (!confirm('¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer.')) {
        return;
    }

    posts = posts.filter(p => p.id !== postId);
    renderPostsList();
    alert('✅ Publicación eliminada. No olvides descargar el JSON actualizado.');
}

function savePost() {
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;
    const content = document.getElementById('contentInput').value;
    const imageUrl = document.getElementById('imageInput').value;
    const videoUrl = document.getElementById('videoInput').value;
    const scheduledDate = document.getElementById('scheduleInput').value;

    if (!title || !description || !content || !imageUrl) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    if (editingPostId) {
        // Update existing post
        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                title,
                description,
                content,
                imageUrl,
                videoUrl: videoUrl || undefined,
                createdAt: scheduledDate ? new Date(scheduledDate).toISOString() : posts[postIndex].createdAt,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            };
        }
        alert('✅ Noticia actualizada. No olvides descargar el JSON actualizado.');
    } else {
        // Create new post
        const newPost = {
            id: Date.now().toString(),
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            description,
            content,
            imageUrl,
            videoUrl: videoUrl || undefined,
            createdAt: scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString(),
            author: 'Admin',
            likes: 0
        };

        posts.unshift(newPost);
        alert('✅ Noticia creada. No olvides descargar el JSON actualizado y subirlo al repositorio.');
    }

    renderPostsList();
    hideCreateForm();
}

function downloadJSON() {
    const dataStr = JSON.stringify(posts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'posts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
