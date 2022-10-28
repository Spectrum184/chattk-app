<template>
    <div
        class="h-14 flex justify-between w-full border-b border-gray-200 bg-gray-100"
    >
        <div class="flex items-center pl-4">
            <button @onclick="goHome">
                <span class="text-emerald-500 text-2xl font-semibold"
                    >CHATTK</span
                >
            </button>
        </div>
        <div class="flex items-center pr-4">
            <Avatar size="sm" />
        </div>
    </div>
</template>
<script setup>
import Avatar from "./user/Avatar.vue";
import router from "@/router";

const goHome = () => {
    router.push("/");
};
</script>
