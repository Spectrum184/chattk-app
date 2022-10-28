<template>
    <div class="w-14 bg-gray-100 flex flex-col border-r shadow-sm">
        <router-link
            :to="{ name: 'home' }"
            :class="[
                'hover:opacity-80 transition leading-none p-4 my-2',
                name === 'home' || name === 'chat'
                    ? 'border-l-4 border-emerald-500'
                    : '',
            ]"
        >
            <HomeIcon class="h-6 w-6 text-emerald-500 mx-auto" />
        </router-link>
        <router-link
            :to="{ name: 'friends' }"
            :class="[
                'hover:opacity-80 transition leading-none p-4 my-2',
                name === 'friends' ? 'border-l-4 border-emerald-500' : '',
            ]"
        >
            <IdentificationIcon class="h-6 w-6 text-emerald-500 mx-auto" />
        </router-link>
    </div>
</template>

<script setup>
import { HomeIcon, IdentificationIcon } from "@heroicons/vue/outline";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const name = computed(() => route.name);
</script>
