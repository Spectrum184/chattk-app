import { createI18n } from "vue-i18n";

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
    const modules = import.meta.glob("../locales/*.json");
    const messages = {};

    for (const path in modules) {
        const lang = path.substring(
            path.lastIndexOf("/") + 1,
            path.lastIndexOf("/") + 3
        );
        messages[lang] = {};
        modules[path]().then((mod) => {
            Object.keys(mod.default).forEach((key) => {
                messages[lang][key] = mod.default[key].source;
            });
        });
    }
    console.log(messages);
    return messages;
}

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: import.meta.env.VUE_APP_I18N_LOCALE || "vi",
    fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    messages: loadLocaleMessages(),
});
