import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['prop-types']
  },
  resolve: {
    alias: {
      '@test-plans': resolve(__dirname, 'test-plans')
    }
  },
  json: {
    stringify: true
  }
});