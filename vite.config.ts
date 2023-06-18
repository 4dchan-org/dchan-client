import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html", // will be saved in project's root
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html}']
      }
    })
  ],
  resolve: {
    alias: {
      "src": "/src",
      "lodash": "lodash-es"
    },
  },
  server: {
    port: 4444
  },
  define: { 'process.env': process.env },
  build: {
    outDir: "build"
  }
})
