import { defineConfig } from 'vite';
import glslify from 'rollup-plugin-glslify';

// --- ES Modulesで __dirname が使えないための対処 ---
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- ----

export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  base: './', // 相対パスでビルドする
  root: 'src', // 開発モードのroot
  publicDir: '_public',
  build: {
    // manifest: true,
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        '': path.resolve(__dirname, 'src/index.html'),
        'dom-sample': path.resolve(__dirname, 'src/dom-sample/index.html'),
        'three-sample': path.resolve(__dirname, 'src/three-sample/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '~/': `${__dirname}/src/`,
    },
  },
  plugins: [glslify()],
});
