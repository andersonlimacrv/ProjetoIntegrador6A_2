import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "../../packages/shared/src"),
      },
    },
    server: {
      port: parseInt(env.VITE_CLIENT_PORT || "5173"),
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
