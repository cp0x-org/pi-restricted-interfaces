import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
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

// The site files are also served as plain JSON at the root, so another site can load the same data by URL without
// rebuilding anything: /monitor.json (the dashboard rows) and /<id>.json (one interface's whole record), with CORS
// open (dev server here, serve.json in production). The app itself still bundles them (src/data/dataset.ts).
function siteDataFiles(): Plugin {
  const dir = fileURLToPath(new URL('./src/data/', import.meta.url));
  const fileFor = (url: string): string | null => {
    const m = /^\/([a-z0-9-]+)\.json$/.exec(url.split('?')[0]);
    if (!m) return null;
    const file = m[1] === 'monitor' ? join(dir, 'monitor.json') : join(dir, 'interfaces', `${m[1]}.json`);
    return existsSync(file) ? file : null;
  };
  return {
    name: 'site-data-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = req.url ? fileFor(req.url) : null;
        if (!file) return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(readFileSync(file));
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'monitor.json', source: readFileSync(join(dir, 'monitor.json')) });
      for (const name of readdirSync(join(dir, 'interfaces')).filter((f) => f.endsWith('.json'))) {
        this.emitFile({ type: 'asset', fileName: name, source: readFileSync(join(dir, 'interfaces', name)) });
      }
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
      seoPrerender((env.VITE_SITE_URL || '').trim()),
      siteDataFiles()
    ]
  };
});
