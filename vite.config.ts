import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
 
export default defineConfig(({ mode }) => ({
  server: {
    host: true,  // bind explícito em IPv4 + IPv6
    port: 8080,
    allowedHosts: [
      '678cbe411efb.ngrok-free.app'
    ],
    open: true,
    proxy: {
      '/time': 'http://localhost:8000',
      '/detect': 'http://localhost:8000',
      '/style': 'http://localhost:8000',
        '/flux-edit': 'http://localhost:8000',
        '/inpaint': 'http://localhost:8000',
        
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

