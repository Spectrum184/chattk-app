<template>
    <button
        :class="[
            active ? 'bg-gray-200 text-slate-800' : 'text-slate-800',
            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
        ]"
        @click="() => logout(true, true)"
    >
        <ArrowCircleLeftIcon
            :active="active"
            class="mr-2 h-5 w-5 text-emerald-400"
            aria-hidden="true"
        />
        {{ name }}
    </button>
</template>

<script setup>
import { useLogout } from "@/composables/Logout";
import { ArrowCircleLeftIcon } from "@heroicons/vue/outline";
const props = defineProps(["name", "active"]);

const { logout } = useLogout();
</script>
