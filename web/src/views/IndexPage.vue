<template>
    <LoginPage v-if="!userStore.getUser" />
    <div v-else class="w-full flex items-center justify-center">
        <h1 class="text-black">{{ t("homePage.mainMessage") }}</h1>
    </div>
</template>
<script setup>
import { useUserStore } from "@/stores/user";
import LoginPage from "@/views/LoginPage.vue";
import { useTitle } from "@vueuse/core";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
    inheritLocale: true,
});

const userStore = useUserStore();
useTitle(computed(() => (userStore.getUser ? "Home" : "Log In")));
</script>
