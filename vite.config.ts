import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'collect-routing-fallback',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const parsedUrl = req.url ? req.url.split('?')[0] : '';
            if (parsedUrl.startsWith('/collect/')) {
              const query = req.url && req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
              req.url = '/collect.html' + query;
            } else if (parsedUrl === '/route-test') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/plain');
              res.end('route working');
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'login.html'),
          signup: path.resolve(__dirname, 'signup.html'),
          dashboard: path.resolve(__dirname, 'dashboard.html'),
          collect: path.resolve(__dirname, 'collect.html'),
          profile: path.resolve(__dirname, 'profile.html'),
          supabasetest: path.resolve(__dirname, 'supabase-test.html'),
          minimalauthtest: path.resolve(__dirname, 'minimal-auth-test.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
