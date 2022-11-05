<template>
    <div class="w-14 bg-gray-100 flex flex-col border-r shadow-sm">
        <router-link
            :to="{ name: 'home' }"
            :class="[
                'hover:opacity-80 transition leading-none p-4 my-2 rounded-md',
                name === 'home' || name === 'chat' ? 'bg-gray-200' : '',
            ]"
        >
            <HomeIcon class="h-6 w-6 text-emerald-500 mx-auto" />
        </router-link>
        <router-link
            :to="{ name: 'friends' }"
            :class="[
                'hover:opacity-80 transition leading-none p-4 my-2 rounded-md',
                name === 'friends' ? 'bg-gray-200' : '',
            ]"
        >
            <IdentificationIcon class="h-6 w-6 text-emerald-500 mx-auto" />
        </router-link>
        <router-link
            :to="{
                name: 'profile',
                params: {
                    username: userStore.getUser?.username,
                },
            }"
            :class="[
                'hover:opacity-80 transition leading-none p-4 my-2 rounded-md',
                name === 'profile' ? 'bg-gray-200' : '',
            ]"
        >
            <UserCircleIcon class="h-6 w-6 text-emerald-500 mx-auto" />
        </router-link>
    </div>
</template>

<script setup>
import {
    HomeIcon,
    IdentificationIcon,
    UserCircleIcon,
} from "@heroicons/vue/outline";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const route = useRoute();
const name = computed(() => route.name);
</script>
