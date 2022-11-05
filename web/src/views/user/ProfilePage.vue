<template>
    <div v-if="userInfoStore.getInitialized" class="w-full">
        <div
            class="w-full flex p-9 flex-col items-center"
            v-if="!!userInfoStore.getUserInfo.username"
        >
            <div class="flex">
                <div class="mr-4">
                    <Avatar
                        :avatar="userInfoStore.getUserInfo.avatar"
                        size="lg"
                    />
                </div>
                <div class="flex flex-col justify-center items-baseline">
                    <h3 class="text-slate-800 font-semibold text-lg">
                        {{ userInfoStore.getUserInfo.username }}
                    </h3>
                    <ModalEditProfile
                        v-if="
                            userInfoStore.getUserInfo.username ===
                            userStore.getUser.username
                        "
                    />
                </div>
            </div>
            <div class="mt-8 border-t border-slate-700">
                <h4
                    v-if="
                        !userInfoStore.getUserInfo.isUpdated &&
                        userInfoStore.getUserInfo.username ===
                            userStore.getUser.username
                    "
                    class="text-slate-800"
                >
                    {{ t("userInfoPage.isNotUpdated") }}
                </h4>
                <h4
                    v-else-if="
                        !userInfoStore.getUserInfo.isUpdated &&
                        userInfoStore.getUserInfo.username !==
                            userStore.getUser.username
                    "
                >
                    {{ t("userInfoPage.notUpdated") }}
                </h4>
                <UserProfile v-else />
            </div>
        </div>
        <h4 v-else class="text-rose-500 font-semibold text-2xl text-center">
            {{ t("userInfoPage.noUser") }}
        </h4>
    </div>

    <Spinner v-else class="w-6 h-6 shrink-0 mr-auto ml-auto my-2" />
</template>

<script setup>
import Spinner from "@/components/icons/Spinner.vue";
import Avatar from "@/components/user/Avatar.vue";
import UserProfile from "@/components/profile/UserProfile.vue";
import ModalEditProfile from "@/components/profile/ModalEditProfile.vue";
import { useTitle } from "@vueuse/core";
import { useRoute } from "vue-router";
import { useUserInfoStore } from "@/stores/infoUser";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n({
    inheritLocale: true,
});

const route = useRoute();
const userInfoStore = useUserInfoStore();
const userStore = useUserStore();

useTitle(`Profile | ${route.params.username}`);

onMounted(() => {
    userInfoStore.setUserInfo(route.params.username);
});
</script>
