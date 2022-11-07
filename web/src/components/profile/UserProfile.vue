<template>
    <div class="text-slate-800 grid grid-cols-2 gap-6 my-4">
        <div
            class="font-semibold text-md flex col-span-2 items-center justify-center"
        >
            <span class="mr-4"><UserCircleIcon class="h-6 w-6" /></span>
            {{ userInfoStore.getUserInfo.firstName }}
            {{ userInfoStore.getUserInfo.lastName }}
        </div>
        <div
            class="font-semibold text-md flex items-center"
            v-show="!!userInfoStore.getUserInfo.facebook"
        >
            <span class="mr-4"><Facebook /></span>
            {{ userInfoStore.getUserInfo.facebook }}
        </div>
        <div
            class="font-semibold text-md flex items-center"
            v-show="!!userInfoStore.getUserInfo.twitter"
        >
            <span class="mr-4"><Twitter /></span>
            {{ userInfoStore.getUserInfo.twitter }}
        </div>
        <div
            class="font-semibold text-md flex items-center"
            v-show="!!userInfoStore.getUserInfo.phone"
        >
            <span class="mr-4"><PhoneIcon class="h-6 w-6" /></span>
            {{ userInfoStore.getUserInfo.phone }}
        </div>
        <div
            class="font-semibold text-md flex items-center"
            v-show="!!userInfoStore.getUserInfo.birthday"
        >
            <span class="mr-4"><CakeIcon class="h-6 w-6" /></span>
            {{ userInfoStore.getUserInfo.birthday }}
        </div>
        <div
            class="font-semibold text-md flex items-center"
            v-show="!!userInfoStore.getUserInfo.address"
        >
            <span class="mr-4"><HomeIcon class="h-6 w-6" /></span>
            {{ userInfoStore.getUserInfo.address }}
        </div>
        <div
            class="font-semibold text-md flex items-center"
            v-show="!!userInfoStore.getUserInfo.sex"
        >
            <span class="mr-4"><HeartIcon class="h-6 w-6" /></span>
            {{ $t(`userInfoPage.${userInfoStore.getUserInfo.sex}`) }}
        </div>
        <div
            class="font-semibold text-md col-span-2 italic flex"
            v-show="!!userInfoStore.getUserInfo.bio"
        >
            <span class="self-start mr-4"><CodeIcon class="h-6 w-6" /></span>
            {{ userInfoStore.getUserInfo.bio }}
        </div>
    </div>
</template>

<script setup>
import Facebook from "@/components/icons/Facebook.vue";
import Twitter from "@/components/icons/Twitter.vue";
import { useUserInfoStore } from "@/stores/infoUser";
import {
    UserCircleIcon,
    PhoneIcon,
    CakeIcon,
    CodeIcon,
    HomeIcon,
    HeartIcon,
} from "@heroicons/vue/outline";

const userInfoStore = useUserInfoStore();
</script>
