import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://alejandrodongar.github.io',
  base: '/2DAM',
  integrations: [mdx()],
  markdown: {
    // Mismos colores de código en los dos temas; los cambia la variable CSS
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
});
