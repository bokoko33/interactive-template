import { defineConfig } from 'vite';

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
  root: './src',
  build: {
    base: './', // 相対パスでビルドする
    outDir: '../dist', // 出力場所の指定
  },
  resolve: {
    alias: {
      '~/': `${__dirname}/src/`,
    },
  },
  plugins: [],
});
