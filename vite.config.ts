import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import BabelPluginReactCompiler from "babel-plugin-react-compiler";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routeFileIgnorePrefix: "-",
      target: "react",
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", BabelPluginReactCompiler]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
