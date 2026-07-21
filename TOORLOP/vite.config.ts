import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Maps '@' to the 'src' directory for cleaner imports (e.g. '@/components/...')
        '@': path.resolve((process as any).cwd(), './src'),
      },
    },
    server: {
      host: '0.0.0.0', // Expose to network/container (crucial for Replit)
      port: parseInt(env.VITE_PORT || '5000'),
      strictPort: true,
      cors: true,
      // Security headers for development server
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
      allowedHosts: ['all'], // Allow cloud IDE previews
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PREVIEW_PORT || '8080'),
      allowedHosts: ['all'],
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // Enable sourcemaps in dev for easier debugging
      // Advanced chunking strategy for performance
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react'],
            'vendor-utils': ['@google/genai'],
          },
        },
      },
      // Increase chunk size warning limit to prevent noise during build
      chunkSizeWarningLimit: 1000,
    },
  };
});