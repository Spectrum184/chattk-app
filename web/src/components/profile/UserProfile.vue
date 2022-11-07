<template>
    <div class="text-slate-800">
        <h1>{{ userInfoStore.getUserInfo }}</h1>
    </div>
</template>

<script setup>
import { useUserInfoStore } from "@/stores/infoUser";

const userInfoStore = useUserInfoStore();
</script>
