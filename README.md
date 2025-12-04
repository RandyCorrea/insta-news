# InstaNews - Plataforma de Noticias Estilo Instagram

Esta es una aplicación web estática construida con Next.js que imita la estética de Instagram para presentar noticias.

## Características

- **Diseño Mobile-First**: Estética similar a Instagram.
- **Feed de Noticias**: Scroll infinito (simulado) con tarjetas visuales.
- **Páginas de Detalle**: Cada noticia tiene su propia URL para compartir.
- **SEO Optimizado**: Meta tags dinámicos para Twitter y OpenGraph.
- **CMS Integrado**: Panel de administración secreto (`/admin-secret-access`) para crear noticias.
- **Seguridad**: Bloqueo de acceso tras 3 intentos fallidos.

## Cómo Usar el CMS

1. Accede a `/admin-secret-access`.
2. Contraseña por defecto: `admin` (Cámbiala en el código si es necesario).
3. Crea una nueva noticia.
4. **IMPORTANTE**: Como es una web estática, al guardar una noticia, descarga el archivo `posts.json` y súbelo a la carpeta `data/` en tu repositorio de GitHub para que los cambios se reflejen en la web pública.

## Despliegue

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.

1. Ve a `Settings` > `Pages` en tu repositorio de GitHub.
2. En "Build and deployment", selecciona "GitHub Actions".
3. El workflow se encargará del resto.
