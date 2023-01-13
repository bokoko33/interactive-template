import { defineConfig } from 'vite';
import glslify from 'rollup-plugin-glslify';

// --- ES Modulesで __dirname が使えないための対処 ---
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- ----

// ref: https://zenn.dev/sakata_kazuma/articles/59a741489c8bbc
export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  // base: './', // 相対パスでビルドする
  root: 'src', // 開発モードのroot
  build: {
    // manifest: true,
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        '': path.resolve(__dirname, 'src/index.html'),
        sample01: path.resolve(__dirname, 'src/sample01/index.html'),
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
