import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Dukung deployment Vercel (root '/'), GitHub Actions Pages ('/Masjid-As-Safar/'), dan custom via BASE_PATH
  const isVercel = Boolean(process.env.VERCEL);
  const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
  const base = process.env.BASE_PATH || (isVercel ? '/' : isGitHubActions ? '/Masjid-As-Safar/' : './');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-three': ['three'],
            'vendor-react': ['react', 'react-dom'],
            'vendor-qrcode': ['qrcode'],
          },
        },
      },
    },
  };
});