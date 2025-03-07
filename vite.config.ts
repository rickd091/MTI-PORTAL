import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import path from "path";

// Add this block of code
const conditionalPlugins = [];
if (process.env.TEMPO) {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log(`Building for mode: ${mode}`);
  console.log('Environment variables loaded:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
  });

  return {
    plugins: [
      react({
        plugins: [...conditionalPlugins],
      }),
      tempo(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Ensure import.meta.env is properly populated
      // This is redundant as Vite does this automatically, but we're being explicit
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      // Legacy process.env support (though we should use import.meta.env instead)
      "process.env": {},
    },
    // Add better error handling for build process
    build: {
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, warn) {
          // Log all warnings
          console.log('Build warning:', warning);
          warn(warning);
        },
      },
    },
    // Improve dev server logging
    server: {
      hmr: {
        overlay: true,
      },
    },
  };
});
