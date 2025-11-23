import { defineConfig } from 'vite';
import path from 'node:path';

export default async () => {
  const { default: vue } = await import('@vitejs/plugin-vue');
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // 根据你的项目结构调整 root/outDir
    root: path.resolve(__dirname, 'src/renderer/vue-template'),
    server: { port: 5173 },
    build: {
      outDir: path.resolve(__dirname, '.vite', 'renderer'),
      emptyOutDir: true,
    },
  });
};
