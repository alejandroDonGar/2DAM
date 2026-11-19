import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Una unidad = un archivo MDX en src/content/unidades/<asignatura>/<unidad>.mdx
const unidades = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/unidades' }),
  schema: z.object({
    titulo: z.string(),
    etiqueta: z.string(),            // «UT1», «Intro»…
    orden: z.number(),
    entrada: z.string(),
    cuando: z.string(),
    ejercicios: z.string(),
    ruta: z.object({ texto: z.string(), url: z.string() }).optional(),
    crud: z.number().optional(),     // solo Acceso a Datos: paso de «El mismo CRUD»
  }),
});

export const collections = { unidades };
