import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  skipNodeModulesBundle: true,
  shims: false,
  dts: false,
  external: [/^[^.\/]|^\.[^.\/]|^\.\.[^\/]/],
});

