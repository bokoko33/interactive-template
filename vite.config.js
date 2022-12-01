import { defineConfig } from 'vite';

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
  root: './src',
  build: {
    base: './', // 相対パスでビルドする
    outDir: '../dist', // rootをsrcにしているので、出力場所を調整
    rollupOptions: {
      output: {},
    },
  },
  resolve: {
    alias: {
      '~/': `${__dirname}/src/`,
    },
  },
  plugins: [],
});
