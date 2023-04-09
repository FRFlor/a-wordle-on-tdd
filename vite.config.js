import vuePlugin from "@vitejs/plugin-vue";
import path from "path"
import {defineConfig} from "vitest/config";

export default defineConfig({
    plugins: [vuePlugin()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    test: {
        globals: true,
        environment: "happy-dom"
    }
})