<template>
    <div
        class="h-14 flex justify-between w-full border-b border-gray-200 bg-gray-100"
    >
        <div class="flex items-center pl-4">
            <button @click="goHome">
                <span class="text-emerald-500 text-2xl font-semibold"
                    >CHATTK</span
                >
            </button>
        </div>
        <div class="flex items-center pr-4">
            <div class="text-right z-50 flex items-center justify-end w-full">
                <Menu as="div" class="relative my-auto inline-block text-left">
                    <MenuButton class="flex items-center">
                        <Avatar size="xs" />
                    </MenuButton>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <MenuItems
                            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                    <button
                                        :class="[
                                            active
                                                ? 'bg-gray-200 text-slate-800'
                                                : 'text-slate-800',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                        ]"
                                    >
                                        <UserCircleIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5 text-emerald-400"
                                            aria-hidden="true"
                                        />
                                        {{ t("homePage.profile") }}
                                    </button>
                                </MenuItem>
                            </div>
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                    <LogoutButton
                                        :name="t('homePage.logout')"
                                        :active="active"
                                    />
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>
    </div>
</template>
<script setup>
import Avatar from "./user/Avatar.vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { UserCircleIcon } from "@heroicons/vue/outline";
import { useI18n } from "vue-i18n";
import router from "@/router";
import LogoutButton from "@/components/LogoutButton.vue";

const { t } = useI18n({
    inheritLocale: true,
});
const goHome = () => {
    router.push("/");
};
</script>
