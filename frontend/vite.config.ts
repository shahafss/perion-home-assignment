import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_URL || "http://localhost:4000";
  const shouldStripApiPrefix = env.VITE_PROXY_STRIP_API === "true";

  return {
    plugins: [vue(), vueJsx()],
    server: {
      host: true,
      port: 3000,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) =>
            shouldStripApiPrefix ? path.replace(/^\/api/, "") : path,
        },
      },
    },
  };
});
