# Bosques de Pinamar — DFS Studio

Presentación web del proyecto **Bosques de Pinamar**: tres propuestas de materialidades (Arena, Terracota y Mineral), recorrido de imágenes, paisajismo, síntesis de elección y plantas en negativo ampliables.

Sitio estático: HTML, CSS y JavaScript sin dependencias ni pasos de compilación.

## Estructura

```
bosques-pinamar/
├── index.html              Página principal
├── .nojekyll               Evita que GitHub Pages procese el sitio con Jekyll
└── assets/
    ├── css/
    │   ├── fonts.css       Tipografía DFS
    │   └── style.css       Estilos
    ├── js/app.js           Parallax, índice, pestañas de propuestas y visor de plantas
    ├── fonts/              dfs-300 / 400 / 600 (.woff2)
    ├── img/                Imágenes (00 = portada, 01–21 = galería en orden)
    └── plantas/            planta-baja.svg y planta-alta.svg
```

## Publicar con GitHub Pages

1. Crear un repositorio nuevo en GitHub (por ejemplo `bosques-pinamar`).
2. Subir **el contenido** de esta carpeta a la raíz del repositorio (botón *Add file → Upload files*, arrastrar todo, incluido `.nojekyll`).
3. En el repositorio: *Settings → Pages → Build and deployment*, elegir **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guardar.
4. En uno o dos minutos el sitio queda en `https://<usuario>.github.io/bosques-pinamar/`.

> Nota: el archivo `.nojekyll` empieza con punto y algunos sistemas lo ocultan. Si no se sube, el sitio funciona igual.

## Ver en local

Abrir `index.html` con doble clic, o servir la carpeta:

```
python -m http.server 8000
```

y entrar a `http://localhost:8000`.

## Editar

- **Textos:** directamente en `index.html`.
- **Imágenes:** reemplazar el archivo en `assets/img/` manteniendo el mismo nombre (formato apaisado, ~1600 px de ancho).
- **Contacto:** al final de `index.html`, bloque `<footer>`.

---

DFS Studio · Arq & Design · Arq. Facundo Brandel · [dfsestudio.com.ar](https://dfsestudio.com.ar) · 2026
