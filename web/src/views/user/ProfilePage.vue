<template>
    <div v-if="userInfoStore.getInitialized" class="w-full">
        <div
            class="w-full flex p-9 flex-col items-center"
            v-if="!!userInfoStore.getUserInfo.username"
        >
            <div class="flex">
                <div class="mr-4 cursor-pointer" @click="handleClickAvatar">
                    <Avatar
                        :avatar="userInfoStore.getUserInfo.avatar"
                        size="xl"
                    />
                </div>
                <div class="flex flex-col justify-center items-baseline">
                    <h3 class="text-slate-800 font-semibold text-xl my-2">
                        {{ userInfoStore.getUserInfo.username }}
                    </h3>
                    <ModalEditProfile v-if="canUpdate" />
                </div>
            </div>
            <div class="mt-8 border-t border-slate-700">
                <h4
                    v-if="!userInfoStore.getUserInfo.isUpdated && canUpdate"
                    class="text-slate-800"
                >
                    {{ $t("userInfoPage.isNotUpdated") }}
                </h4>
                <h4
                    v-else-if="
                        !userInfoStore.getUserInfo.isUpdated && !canUpdate
                    "
                >
                    {{
                        $t(
                            canUpdate
                                ? "userInfoPage.notUpdated"
                                : "userInfoPage.viewAvatar"
                        )
                    }}
                </h4>
                <UserProfile v-else />
            </div>
        </div>
        <h4 v-else class="text-rose-500 font-semibold text-2xl text-center">
            {{ $t("userInfoPage.noUser") }}
        </h4>
        <TransitionRoot appear :show="isOpenModal" as="template">
            <Dialog as="div" @close="setOpenModal(false)" class="relative z-10">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div
                        class="flex min-h-full items-center justify-center p-4 text-center"
                    >
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                                class="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                            >
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {{
                                        $t(
                                            canUpdate
                                                ? "userInfoPage.editAvatar"
                                                : "userInfoPage.viewAvatar"
                                        )
                                    }}
                                </DialogTitle>
                                <div
                                    class="mt-2 flex flex-col w-[400px] justify-center items-center"
                                >
                                    <Avatar
                                        :avatar="
                                            !!userAvatar
                                                ? userAvatar.url
                                                : userInfoStore.getUserInfo
                                                      .avatar
                                        "
                                        size="xl"
                                    />
                                    <div
                                        class="flex justify-center items-center w-full"
                                        v-show="canUpdate"
                                    >
                                        <label
                                            for="dropzone-file"
                                            class="flex flex-col my-4 justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                        >
                                            <div
                                                class="flex flex-col justify-center items-center pt-5 pb-6"
                                            >
                                                <UploadIcon
                                                    class="mb-3 w-6 h-6 text-gray-400"
                                                />
                                                <p
                                                    class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                                                    v-html="
                                                        $t(
                                                            'userInfoPage.dragDrop'
                                                        )
                                                    "
                                                ></p>
                                                <p
                                                    class="text-xs text-gray-500 dark:text-gray-400"
                                                >
                                                    SVG, PNG, JPG (MAX.
                                                    600x600px)
                                                </p>
                                            </div>
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                name="avatar"
                                                accept="image/*"
                                                @change="onFileChanged($event)"
                                                class="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            class="inline-flex justify-center rounded px-4 py-2 text-sm h-9 font-medium bg-rose-500"
                                            @click="setOpenModal(false)"
                                        >
                                            {{
                                                $t(
                                                    canUpdate
                                                        ? "cancel"
                                                        : "close"
                                                )
                                            }}
                                        </button>
                                        <button
                                            v-show="canUpdate"
                                            type="button"
                                            class="inline-flex ml-4 justify-center rounded px-4 py-2 text-sm h-9 font-medium bg-emerald-500 hover:opacity-80 disabled:bg-slate-400"
                                            @click="updateAvatar"
                                            :disabled="!Boolean(userAvatar)"
                                        >
                                            {{ $t("userInfoPage.save") }}
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
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
import { ref, computed, onUnmounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
} from "@headlessui/vue";
import { UploadIcon } from "@heroicons/vue/solid";
import { logger } from "@/utils/logger";
import { useToast } from "vue-toastification";
const toast = useToast();

const route = useRoute();
const userInfoStore = useUserInfoStore();
const userStore = useUserStore();
const isOpenModal = ref(false);
const userAvatar = ref(null);
const canUpdate = computed(() =>
    userInfoStore.getCanUpdated(userStore.getUser.username)
);

useTitle(
    `Profile | ${
        userInfoStore.getUserInfo?.username
            ? route.params.username
            : userInfoStore.getUserInfo?.username
    }`
);

function setOpenModal(value) {
    isOpenModal.value = value;
}

function onFileChanged($event) {
    const target = $event.target;
    if (target && target.files) {
        userAvatar.value = {
            file: target.files[0],
            url: URL.createObjectURL(target.files[0]),
        };
    }
}

function handleClickAvatar() {
    userAvatar.value = null;
    setOpenModal(true);
}

async function updateAvatar() {
    if (!userAvatar.value?.file) return;
    userInfoStore.updateAvatar(userAvatar.value.file).then((data) => {
        if (data.ok) {
            setOpenModal(false);
        } else {
            toast.error("Oops!");
        }
    });
}

watch(
    () => route.params.username,
    (username) => {
        logger.web.info(username);
        if (!username) return;
        userInfoStore.setUserInfo(username);
    },
    {
        deep: true,
        immediate: true,
    }
);

onUnmounted(() => {
    userInfoStore.clearUserInfo();
});
</script>
