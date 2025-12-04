# InstaNews - Sistema de Noticias Estilo Instagram

Plataforma web estática de noticias con diseño inspirado en Instagram, construida con HTML5, JavaScript Vanilla y Tailwind CSS.

## 🌟 Características

- ✨ **Diseño Mobile-First** tipo Instagram
- 📱 **Responsive** y optimizado para móviles
- 🔒 **CMS Seguro** con bloqueo tras 3 intentos fallidos
- 🌐 **SEO Optimizado** con meta tags para redes sociales
- 📤 **Compartir** en WhatsApp, Twitter, Facebook
- ⏰ **Programación** de publicaciones
- 🎨 **Modo Oscuro** automático

## 📏 Especificaciones de Imagen

**Tamaño ideal para imágenes:**
- **Formato 4:5** (Instagram Post): 1080 x 1350 px
- **Formato 1:1** (Cuadrado): 1080 x 1080 px

## 🔐 Acceso al CMS

1. Abre `admin.html`
2. **Contraseña predeterminada:** `admin`
3. Crea tus noticias
4. Descarga el archivo `posts.json` actualizado
5. Reemplaza `data/posts.json` en tu repositorio

## 🚀 Despliegue en GitHub Pages

1. Sube todo el proyecto a tu repositorio
2. Ve a **Settings** > **Pages**
3. En "Source", selecciona la rama `main` y carpeta `/` (root)
4. Tu web estará en: `https://TuUsuario.github.io/insta-news/`

## 📝 Cómo Publicar Noticias

### Desde el CMS:
1. Accede a `admin.html` con la contraseña
2. Clic en el botón **+** (Crear)
3. Completa el formulario:
   - Título
   - Descripción corta (para el feed)
   - Contenido completo
   - URL de imagen (o Ctrl+V para pegar)
   - (Opcional) URL de video de YouTube
   - (Opcional) Programar fecha de publicación
4. Clic en **Guardar Noticia**
5. Clic en el botón verde de **Descargar** 
6. Reemplaza `data/posts.json` en GitHub con el archivo descargado

### Manualmente:
Edita `data/posts.json` siguiendo esta estructura:

```json
{
  "id": "3",
  "slug": "url-amigable",
  "title": "Título de la Noticia",
  "description": "Descripción corta",
  "content": "Contenido completo...",
  "imageUrl": "https://...",
  "videoUrl": "https://youtube.com/... (opcional)",
  "createdAt": "2024-12-04T10:00:00Z",
  "author": "Tu Nombre",
  "likes": 0
}
```

## 🛠️ Estructura del Proyecto

```
insta-news/
├── index.html          # Página principal (feed)
├── post.html           # Página de detalle de noticia
├── admin.html          # Panel de administración
├── css/
│   └── styles.css     # Estilos personalizados
├── js/
│   ├── app.js         # Lógica principal
│   └── admin.js       # Lógica del CMS
└── data/
    └── posts.json     # Base de datos de noticias
```

## 🔒 Seguridad

- **Contraseña:** Cambia `ADMIN_PASSWORD` en `js/admin.js`
- **Bloqueo:** Tras 3 intentos fallidos, el acceso se bloquea por 30 días
- **Nota:** Para producción real, considera usar un backend con autenticación JWT

## 💡 Notas Importantes

- Las noticias programadas para el futuro **no se mostrarán** hasta su fecha
- Los posts se ordenan del más reciente al más antiguo
- Las imágenes en Base64 son pesadas; usa URLs de servicios como Unsplash, Imgur o tu propio servidor

## 📦 Sin Build, Sin Problemas

Este proyecto es **totalmente estático**:
- ✅ No requiere Node.js
- ✅ No requiere compilación
- ✅ No requiere servidor
- ✅ Funciona directamente abriendo `index.html` en el navegador

---

**¿Preguntas?** Edita este README o consulta la documentación en el código.
