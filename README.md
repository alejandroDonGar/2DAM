# Apuntes 2º DAM

Web de apuntes de 2º DAM (curso 2026-2027) hecha con [Astro](https://astro.build/) y publicada en GitHub Pages:

<https://alejandrodongar.github.io/2DAM/>

## Probar en local

```bash
npm install
npm run dev
```

La web queda en <http://localhost:4321/2DAM/>. Cada push a `main` la publica con GitHub Actions (`.github/workflows/docs.yml`).

## Organización

- `src/content/unidades/<asignatura>/<unidad>.mdx`: una unidad por archivo, con un `##` por tema y los apartados de la plantilla (qué se ve, conceptos, código paso a paso, errores típicos, prácticas de clase, repaso rápido y fuentes).
- `src/data/asignaturas.ts`: las asignaturas y su color de resaltador.
- `src/components/`: `Fragmento` (código con el ejercicio del que sale), `Pasos` y `Paso` (código paso a paso) y `Crud` (la línea de Acceso a Datos).
- `public/apuntes.css` y `public/apuntes.js`: estilos y comportamiento comunes.
