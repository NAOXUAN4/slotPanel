// vite.worker.config.ts
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    // 开启 source map 方便调试
    sourcemap: 'inline',
    // 确保构建出的代码是针对 Node 环境的
    target: 'node16', // 或者和你主进程一致的版本
    outDir: '.vite/build', // Forge 默认的输出目录，不要乱改，保持统一
    rollupOptions: {
      // 确保 external 依赖处理正确（比如 node 内置模块）
      external: ['electron', /math_core/],
    },
    lib: {
      entry: 'src/workers/worker.ts', // 指定入口
      formats: ['cjs'], // Electron 主进程/Worker 目前主要还是用 CJS
      fileName: () => '[name].js',
    },
    // 关闭空 outDir 清理，因为 main/preload/worker 都在同一个目录，清理会导致互相删除
    emptyOutDir: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/workers/wasm/',
          dest: '.',
        },
      ],
    }),
  ],
});
