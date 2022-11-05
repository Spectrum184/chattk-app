import vi from "@/locales/vi.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";
import { createI18n } from "vue-i18n";

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: import.meta.env.VITE_APP_I18N_LOCALE || "vi",
    fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || "vi",
    messages: {
        vi,
        en,
        ja,
    },
});
