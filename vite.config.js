import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import packagejson from './package.json';
const versionnumber = packagejson.version;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read .env.json file
let googleAnalytics = '';
try {
  const envFile = readFileSync(resolve(__dirname, '.env.json'), 'utf8');
  const envData = JSON.parse(envFile);
  googleAnalytics = envData.googleanalytics || '';
} catch (error) {
  // File doesn't exist or is invalid, use empty string
  console.log('No .env.json file found, using empty string for googleAnalytics');
  googleAnalytics = '';
}

export default defineConfig(({ command }) => ({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        about: 'src/about.html' 
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      'bootstrap-icons': resolve(__dirname, 'node_modules/bootstrap-icons/font/bootstrap-icons.css'),
    }
  },
  optimizeDeps: {
    include: [
      'jquery',
      'bootstrap',
      'bootstrap-icons',
      'datatables.net',
      'datatables.net-bs5',
      'datatables.net-dt',
      'luxon',
      'clipboard'
    ]
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/__VERSIONNUMBER__/g, versionnumber)
          .replace(/<!-- Google Analytics -->/g, (command === 'build') ? googleAnalytics : '<!-- Google Analytics -->');
      },
      transform(html, id) {
        if (id.endsWith('about.html')) {
          return html
            .replace(/__VERSIONNUMBER__/g, versionnumber)
            .replace(/<!-- Google Analytics -->/g, (command === 'build') ? googleAnalytics : '<!-- Google Analytics -->');
          }
      }
    }
  ],
}));
