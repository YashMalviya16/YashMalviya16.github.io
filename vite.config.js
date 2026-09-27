import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User site (yashmalviya16.github.io) is served from the domain root, so base stays '/'.
export default defineConfig({
  plugins: [react()],
  server: {
    // Source photos and the old site aren't part of the app; watching them can crash the
    // dev server on Windows while large files are still being copied in (EBUSY).
    watch: { ignored: ['**/photos/**', '**/legacy/**'] },
  },
});
