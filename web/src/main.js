import "@/assets/tailwind.css";
import "vue-toastification/dist/index.css";
import "floating-vue/dist/style.css";

import { defaultConfig, plugin } from "@formkit/vue";
import FloatingVue from "floating-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import Toast from "vue-toastification";

import App from "./App.vue";
import router from "./router";
import { i18n } from "./utils/i18n";

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(plugin, defaultConfig);
app.use(Toast, {
    position: "top-center",
    transition: "Vue-Toastification__fade",
    closeOnClick: true,
    pauseOnFocusLoss: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    closeButton: "button",
    icon: true,
    rtl: false,
});
app.use(FloatingVue);
app.mount("#app");
