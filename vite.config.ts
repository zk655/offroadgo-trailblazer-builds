import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://klrfknycnjxtelwpbwvx.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscmZrbnljbmp4dGVsd3Bid3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjA1MzcsImV4cCI6MjA4MDkzNjUzN30.CuPY7izpwNwpMRMbqcXTmZePplPMne0tATkzAESr4gs'),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify('klrfknycnjxtelwpbwvx'),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
