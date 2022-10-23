import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath, URL } from "url";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueI18n({
            include: path.resolve(__dirname, "./src/locales/**"),
            runtimeOnly: false,
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
        },
    },
});
