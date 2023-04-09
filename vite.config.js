import {defineConfig} from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import path from "path"

export default defineConfig({
    plugins: [vuePlugin()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
})