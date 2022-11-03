<template>
    <div
        v-if="userInfoStore.getInitialized"
        class="w-full flex justify-center p-9"
    >
        <div class="mr-4">
            <Avatar :avatar="userInfoStore.getUserInfo?.avatar" size="lg" />
        </div>
        <div class="">
            <h1 class="text-black">
                {{ userInfoStore.getUserInfo?.username }}
            </h1>
        </div>
    </div>
    <Spinner v-else class="w-6 h-6 shrink-0 mr-auto ml-auto my-2" />
</template>

<script setup>
import Spinner from "@/components/icons/Spinner.vue";
import Avatar from "@/components/user/Avatar.vue";
import { useTitle } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useUserInfoStore } from "@/stores/infoUser";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const userInfoStore = useUserInfoStore();
const userStore = useUserStore();

useTitle(`Profile | ${route.params.username}`);

onMounted(() => {
    userInfoStore.setUserInfo(route.params.username);
});
</script>
