<template>
    <LoginPage v-if="!userStore.getUser" />
    <div v-else class="w-full flex justify-center">
        <p
            class="text-center w-full bg-rose-500 text-sm self-start"
            v-if="internalMiscStore.wsNetworkError"
        >
            {{ $t("chatPage.reconnecting") }}
        </p>
        <h1 class="text-black self-center">
            {{ $t("homePage.mainMessage") }}
        </h1>
    </div>
</template>
<script setup>
import { useUserStore } from "@/stores/user";
import LoginPage from "@/views/LoginPage.vue";
import { useInternalMiscStore } from "@/stores/internalMisc";
import { useTitle } from "@vueuse/core";
import { computed } from "vue";

const internalMiscStore = useInternalMiscStore();

const userStore = useUserStore();
useTitle(computed(() => (userStore.getUser ? "Home" : "Log In")));
</script>
