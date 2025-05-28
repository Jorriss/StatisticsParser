import { defineConfig } from 'vite';
import { resolve } from 'path';

import packagejson from './package.json';
const versionnumber = packagejson.version;

export default defineConfig({
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
        return html.replace(/__VERSIONNUMBER__/g, versionnumber);
      },
      transform(html, id) {
        if (id.endsWith('about.html')) {
          return html.replace(/__VERSIONNUMBER__/g, versionnumber);
        }
      }
    }
  ],
});
