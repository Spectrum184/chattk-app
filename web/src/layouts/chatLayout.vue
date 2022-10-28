<template>
    <template v-if="userStore.auth.user">
        <div class="flex h-screen flex-col">
            <Navbar />
            <div class="flex h-layout">
                <MenuBar />
                <LeftSideBar
                    v-if="router.name === 'home' || router.name === 'chat'"
                />
                <router-view :key="$route.params.id"> </router-view>
            </div>
        </div>
    </template>
    <RouterView v-else />
</template>

<script setup>
import MenuBar from "@/components/MenuBar.vue";
import Navbar from "@/components/Navbar.vue";
import LeftSideBar from "@/components/chat/LeftSideBar.vue";

import { useUserStore } from "@/stores/user";
import { RouterView, useRoute } from "vue-router";

const userStore = useUserStore();
const router = useRoute();
</script>
