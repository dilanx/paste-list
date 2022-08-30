import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'edit.html'),
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
  plugins: [react()],
});
