import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    target: 'esnext',
    emptyOutDir: false, // So that popup build files don't get deleted
    rollupOptions:{
      input:{
        contentScript: "src/contentScript.ts",
        background: "src/background.ts",
      },
      output:{
        entryFileNames: "[name].js"
      }
    },
  },
})
