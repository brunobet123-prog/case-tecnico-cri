import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { suggestMessagePlugin } from './vite.suggest-plugin.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), suggestMessagePlugin(env)],
    server: {
      port: 5173,
      strictPort: true,
    },
  };
});
