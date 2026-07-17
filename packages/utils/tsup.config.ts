import { defineConfig } from 'tsup';

export default defineConfig({
  // 与 package.json exports 子路径对齐：.、./object、./dom、./eventbus
  entry: ['src/index.ts', 'src/object/index.ts', 'src/dom/index.ts', 'src/eventbus/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: [/^@xiaoye-ui\//],
});
