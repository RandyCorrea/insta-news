// Admin Panel JavaScript
const ADMIN_PASSWORD = 'admin';
let posts = [];
let isAuthenticated = false;

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

    if (videoInput) {
        videoInput.addEventListener('input', handleVideoInput);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMessage');
    const lockoutMsg = document.getElementById('lockoutMessage');

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
            </div>
        `).join('');
}

function showCreateForm() {
    document.getElementById('postsList').classList.add('hidden');
    document.getElementById('createForm').classList.remove('hidden');
}

function hideCreateForm() {
    document.getElementById('postsList').classList.remove('hidden');
    document.getElementById('createForm').classList.add('hidden');
    clearForm();
}

function clearForm() {
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('contentInput').value = '';
    document.getElementById('imageInput').value = '';
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
                    alert('Imagen pegada. Nota: Las imágenes en Base64 son pesadas. Se recomienda usar URLs externas para producción.');
                };
                reader.readAsDataURL(blob);
            }
        }
    }
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
    renderPostsList();
    hideCreateForm();

    alert('✅ Noticia guardada. No olvides descargar el JSON actualizado y subirlo al repositorio.');
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
