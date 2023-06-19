import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from "rollup-plugin-visualizer";
import * as child from "child_process";
import { DateTime } from 'luxon';

const buildVersion = child.execSync("git rev-parse --short HEAD").toString().replace("\n", "") + "/" + DateTime.now().toUnixInteger();

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
  define: { 
    'process.env': process.env,
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  build: {
    outDir: "build"
  }
})
