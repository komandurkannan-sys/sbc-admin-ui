import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/admin": {
        target: "https://clrhkahumi.execute-api.eu-west-1.amazonaws.com",
        changeOrigin: true,
        rewrite: p => p.replace(/^\/admin/, "/dev/admin")
      }
    }
  }
});
