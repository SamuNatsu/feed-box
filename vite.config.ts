/// Vite config
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Plugins
import icons from 'unplugin-icons/vite';
import vue from '@vitejs/plugin-vue';

// Export config
export default defineConfig(async () => ({
  plugins: [icons({ autoInstall: true }), vue()],
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    }
  }
}));
