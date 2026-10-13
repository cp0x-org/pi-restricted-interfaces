import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { buildSeoFiles, loadDataset } from './src/seo/prerender';

// Prerenders one HTML file per route (own <title>, description, canonical, Open Graph, JSON-LD and a static copy of the
// content), plus sitemap.xml, robots.txt and 404.html, from the site files in src/data. Part of `pnpm build`, no extra step.
function seoPrerender(siteUrl: string): Plugin {
  return {
    name: 'seo-prerender',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const entry = bundle['index.html'];
      if (!entry || entry.type !== 'asset') return;
      const dataset = loadDataset(fileURLToPath(new URL('./src/data/', import.meta.url)));
      for (const file of buildSeoFiles(String(entry.source), dataset, siteUrl)) {
        if (file.fileName === 'index.html') entry.source = file.source;
        else this.emitFile({ type: 'asset', fileName: file.fileName, source: file.source });
      }
      if (!siteUrl) this.warn('VITE_SITE_URL is not set: sitemap.xml, canonical and og:url are not emitted');
    }
  };
}

export default defineConfig(({ mode }) => {
  // depending on your application, base can also be "/"
  const env = loadEnv(mode, process.cwd(), '');
  // const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const API_URL = '/';
  const PORT = 3000;

  return {
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: PORT,
      host: true
    },
    build: {
      chunkSizeWarningLimit: 1600
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: {
        // { find: '', replacement: path.resolve(__dirname, 'src') },
        // {
        //   find: /^~(.+)/,
        //   replacement: path.join(process.cwd(), 'node_modules/$1')
        // },
        // {
        //   find: /^src(.+)/,
        //   replacement: path.join(process.cwd(), 'src/$1')
        // }
        // {
        //   find: 'assets',
        //   replacement: path.join(process.cwd(), 'src/assets')
        // },
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    },
    base: API_URL,
    plugins: [
      react(),
      tsconfigPaths(),
      svgr({
        svgrOptions: {
          icon: true,
          exportType: 'named'
        },
        include: '**/*.svg'
      }),
      seoPrerender((env.VITE_SITE_URL || '').trim())
    ]
  };
});
