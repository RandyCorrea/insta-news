# InstaNews - Sistema de Noticias Estilo Instagram ✨

Plataforma web estática de noticias con diseño inspirado en Instagram, construida con HTML5, JavaScript Vanilla y Tailwind CSS.

## 🌟 Características Principales

### Del Lado del Cliente
- ✨ **Diseño Mobile-First** tipo Instagram
- 📱 **Responsive** y optimizado para móviles
- ❤️ **Likes Funcionales** guardados en LocalStorage
- 🔖 **Guardar Posts** para ver después
- 👤 **Perfil de Usuario** con posts likeados y guardados en grid
- ⚙️ **Modal de Configuración** con acceso discreto al admin
- 📤 **Compartir** en WhatsApp, Twitter, Facebook
- 📖 **Leer Más** para descripciones largas
- 🎥 **Videos Embebidos** (YouTube, Vimeo, Rumble)
- 🌐 **SEO Optimizado** con meta tags para redes sociales

### Del Lado del CMS (Admin)
- 🔒 **Acceso Seguro** con bloqueo tras 3 intentos fallidos (30 días)
- ✏️ **Crear y Editar** noticias
- 🗑️ **Eliminar** publicaciones
- 📷 **Subir Imágenes** desde archivo o URL
- 📋 **Pegar Imágenes** con Ctrl+V
- 🎬 **Videos Embebidos** con extracción automática de miniaturas
- ⏰ **Programar** publicaciones futuras
- 💾 **Descargar JSON** actualizado

## 📏 Especificaciones de Imagen

**Tamaño ideal para imágenes:**
- **Formato 4:5** (Instagram Post): 1080 x 1350 px
- **Formato 1:1** (Cuadrado): 1080 x 1080 px

Las imágenes se pueden:
- Subir desde archivo (se convierten a Base64)
- Pegar directamente (Ctrl+V)
- Usar URL de servicios externos (Unsplash, Imgur, etc.)

## 🔐 Acceso al CMS

1. Haz clic en el icono de **⚙️ (Settings)** en el header
2. En el modal, haz clic en **"Randy Correa"** (enlace discreto al final)
3. **Contraseña:** `admin`
4. Gestiona tus noticias

**⚠️ Importante:** Para cambiar la contraseña, edita la constante `ADMIN_PASSWORD` en `js/admin.js`.

## 🚀 Despliegue en GitHub Pages

1. Sube todo el proyecto a tu repositorio GitHub
2. Ve a **Settings** > **Pages**
3. En "Source", selecciona **Deploy from a branch**
4. Rama: **`main`**, Carpeta: **`/ (root)`**
5. Tu web estará en: `https://TuUsuario.github.io/nombre-repo/`

## 📝 Cómo Publicar, Editar o Eliminar Noticias

### Crear Nueva Noticia:
1. Accede al CMS (admin.html)
2. Clic en el botón **+** (verde)
3. Completa el formulario:
   - Título, descripción corta, contenido completo
   - Imagen (subir archivo, pegar o URL)
   - (Opcional) Video de YouTube/Vimeo/Rumble
   - (Opcional) Programar fecha de publicación
4. Clic en **Guardar Noticia**
5. Clic en el botón verde **⬇ Descargar**
6. Reemplaza `data/posts.json` en GitHub con el archivo descargado

### Editar Noticia Existente:
1. En la lista de publicaciones, clic en el icono **✏️ azul**
2. Modifica los campos necesarios
3. Clic en **Guardar Noticia**
4. Descarga el JSON actualizado y súbelo a GitHub

### Eliminar Noticia:
1. En la lista de publicaciones, clic en el icono **🗑️ rojo**
2. Confirma la eliminación
3. Descarga el JSON actualizado y súbelo a GitHub

## 🎥 Videos Embebidos

Los videos se incrustan directamente en el feed. Formatos soportados:
- **YouTube**: `https://youtube.com/watch?v=...` o `https://youtu.be/...`
- **Vimeo**: `https://vimeo.com/...`
- **Rumble**: `https://rumble.com/...`

Al pegar una URL de YouTube, se extrae automáticamente la miniatura del video.

## 🛠️ Estructura del Proyecto

```
insta-news/
├── index.html          # Página principal (feed)
├── post.html           # Página de detalle de noticia
├── admin.html          # Panel de administración (CMS)
├── css/
│   └── styles.css     # Estilos personalizados
├── js/
│   ├── app.js         # Lógica del cliente (feed, likes, perfil)
│   └── admin.js       # Lógica del CMS
├── data/
│   └── posts.json     # Base de datos de noticias
└── images/            # Carpeta para imágenes subidas (opcional)
```

## 💡 Características de Usuario

### Likes y Guardados
- **Like**: Haz clic en el ❤️ para guardar en "Liked"
- **Guardar**: Haz clic en el 🔖 para guardar en "Guardados"
- **Ver Perfil**: Haz clic en el icono de 👤 en la barra inferior
- **Pestañas**: Alterna entre "Liked" y "Guardados" en tu perfil
- **Grid Visual**: Los posts se muestran en cuadrícula tipo Instagram

Todos los likes y guardados se almacenan en **LocalStorage** (privacidad total).

### Compartir
- **Botón nativo** de compartir (si está disponible en el dispositivo)
- **Menu fallback** con WhatsApp, Twitter, Facebook y Copiar enlace
- La URL compartida lleva directo al post individual

## 🔒 Seguridad

- **Contraseña**: Protección básica (para producción real, usar backend)
- **Bloqueo automático**: Tras 3 intentos fallidos, bloqueo por 30 días
- **Acceso discreto**: El enlace al admin está oculto en el modal de settings

## 📦 Sin Build, Sin Problemas

Este proyecto es **totalmente estático**:
- ✅ No requiere Node.js
- ✅ No requiere compilación
- ✅ No requiere servidor
- ✅ Funciona directamente abriendo `index.html` en el navegador
- ✅ Compatible con cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.)

## 🎨 Personalización

### Cambiar Colores
Edita `css/styles.css` o ajusta las clases de Tailwind en los HTML.

### Cambiar Contraseña
Edita la constante en `js/admin.js`:
```javascript
const ADMIN_PASSWORD = 'tu-nueva-contraseña';
```

### Agregar Más Campos
Modifica la estructura en `data/posts.json` y ajusta las funciones de render en `js/app.js`.

## 🐛 Solución de Problemas

**P: Los likes no se guardan**  
R: Verifica que LocalStorage esté habilitado en tu navegador.

**P: El video no se reproduce**  
R: Asegúrate de que la URL sea de YouTube, Vimeo o Rumble válida.

**P: Las imágenes no cargan al compartir**  
R: Las meta tags Open Graph requieren URLs absolutas. Sube las imágenes a un servidor externo o usa la carpeta `/images/` de GitHub.

**P: La miniatura no aparece en redes sociales**  
R: Los crawlers de redes sociales cachean las meta tags. Usa herramientas como:
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

---

**Desarrollado por Randy Correa** 🚀
