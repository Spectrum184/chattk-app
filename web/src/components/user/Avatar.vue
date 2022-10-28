<template>
    <div class="relative shrink-0">
        <img
            :src="
                avatar ||
                'https://res.cloudinary.com/thanhtk/image/upload/v1666446309/1400173657.kougyou_tiddeee__1022x1024__rk5jlz.jpg'
            "
            class="rounded-full"
            :height="sizePx"
            :width="sizePx"
            alt="user avatar"
        />
        <div
            v-show="online && typeof online !== 'string'"
            :class="[
                'bg-green-500 rounded-full ring absolute',
                hasFocus ? 'ring-slate-800' : 'ring-slate-900',
                onlineStatusClasses,
            ]"
        ></div>
    </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps(["online", "avatar", "hasFocus", "size"]);

const sizePx = computed(() => {
    if (props.size === "xs") {
        return "30";
    } else if (props.size === "sm") {
        return "35";
    } else if (props.size === "lg") {
        return "95";
    } else return "48";
});
const onlineStatusClasses = computed(() => {
    if (props.size === "xs")
        return; // note: too small, online status probably wouldn't look good on this size.
    else if (props.size === "sm") {
        return "left-7 top-7 w-2.5 h-2.5";
    } else if (props.size === "lg") {
        return "w-6 h-6 left-[4.5rem] top-[4.5rem]";
    }
    return "left-9 top-9 w-3.5 h-3.5";
});
</script>
