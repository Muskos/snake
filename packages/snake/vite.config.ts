/// <reference types='vitest' />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@snake/snake',
      fileName: 'index',
      formats: ['es'],
    },
  },
});
