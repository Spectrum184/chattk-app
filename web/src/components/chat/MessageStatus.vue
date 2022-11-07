<template>
    <Loading v-if="sending && fromSelf && !error" />
    <CheckCircleIcon
        v-else-if="!sending && fromSelf && !error"
        class="h-5 w-5 text-emerald-500"
    />
    <ExclamationIcon
        class="text-orange-300 h-5 w-5"
        v-else-if="fromSelf && error"
    />
</template>
<script setup>
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/vue/outline";
import Loading from "../icons/Loading.vue";

const props = defineProps(["sending", "fromSelf", "error"]);
</script>
