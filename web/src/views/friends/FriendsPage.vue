<template>
    <div class="flex flex-col h-full w-full">
        <div class="h-14 p-2 flex items-center">
            <h2 class="text-2xl leading-none font-medium text-slate-800">
                {{ $t("friendPage.friend") }}
            </h2>
        </div>
        <TabGroup>
            <TabList
                class="flex mx-2 space-x-1 rounded-md bg-gray-300 backdrop-blur-sm p-1"
            >
                <Tab v-slot="{ selected }" class="w-full outline-none">
                    <button
                        :class="[
                            'w-full outline-none rounded py-2.5 text-sm font-medium leading-5 text-white',
                            'ring-gray-200 ring-opacity-60 focus:outline-none focus:ring-2',
                            selected
                                ? 'bg-emerald-500 font-semibold'
                                : 'text-slate-800',
                        ]"
                    >
                        {{ $t("friendPage.friend") }}
                    </button>
                </Tab>
                <Tab v-slot="{ selected }" class="w-full outline-none">
                    <button
                        :class="[
                            'w-full outline-none rounded py-2.5 text-sm font-medium leading-5 text-white',
                            'ring-gray-200 ring-opacity-60 focus:outline-none focus:ring-2',
                            selected
                                ? 'bg-emerald-500 font-semibold'
                                : 'text-slate-800',
                        ]"
                    >
                        {{ $t("friendPage.request") }}
                    </button>
                </Tab>
                <Tab v-slot="{ selected }" class="w-full outline-none">
                    <button
                        :class="[
                            'w-full outline-none rounded py-2.5 text-sm font-medium leading-5 text-white',
                            'ring-gray-200 ring-opacity-60 focus:outline-none focus:ring-2',
                            selected
                                ? 'bg-emerald-500 font-semibold'
                                : 'text-slate-800',
                        ]"
                    >
                        {{ $t("friendPage.addFriend") }}
                    </button>
                </Tab>
            </TabList>
            <TabPanels class="mt-4 text-white mx-2">
                <TabPanel class="focus:outline-none">
                    <FriendUser
                        v-for="friend in userStore.getFriends"
                        :username="friend.username"
                        :online="friend.online"
                        :chat-id="chatsStore.getChatIdOfUserById(friend.id)"
                        :id="friend.id"
                        type="Friend"
                    />
                </TabPanel>
                <TabPanel class="focus:outline-none flex flex-col items-start">
                    <Disclosure
                        default-open
                        as="div"
                        class="mb-2 w-full"
                        v-slot="{ open }"
                    >
                        <DisclosureButton
                            class="text-slate-800 w-full hover:text-white py-2 px-3 hover:bg-emerald-500 rounded-md flex items-center"
                        >
                            <ChevronDownIcon
                                class="w-6 h-6 mr-2 transition transform"
                                :class="open ? '' : '-rotate-90'"
                            />
                            <p class="text-sm leading-none">
                                {{ $t("friendPage.incoming") }} —
                                {{ userStore.getIncomingRequests.length }}
                            </p>
                        </DisclosureButton>
                        <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform -translate-y-2 opacity-0"
                            enter-to-class="transform translate-y-0 opacity-100"
                            leave-active-class="transition duration-75 ease-out"
                            leave-from-class="transform translate-y-0 opacity-100"
                            leave-to-class="transform -translate-y-2 opacity-0"
                        >
                            <DisclosurePanel
                                :class="[
                                    'w-full',
                                    userStore.getIncomingRequests.length
                                        ? 'mt-1'
                                        : '',
                                ]"
                            >
                                <FriendUser
                                    v-for="incomingRequest in userStore.getIncomingRequests"
                                    :username="incomingRequest.username"
                                    :id="incomingRequest.id"
                                    type="Incoming"
                                />
                            </DisclosurePanel>
                        </transition>
                    </Disclosure>
                    <Disclosure
                        default-open
                        as="div"
                        class="w-full"
                        v-slot="{ open }"
                    >
                        <DisclosureButton
                            class="text-slate-800 w-full hover:text-white py-2 px-3 hover:bg-emerald-500 rounded-md flex items-center"
                        >
                            <ChevronDownIcon
                                class="w-6 h-6 mr-2 transition transform"
                                :class="open ? '' : '-rotate-90'"
                            />
                            <p class="text-sm leading-none">
                                {{ $t("friendPage.outgoing") }} —
                                {{ userStore.getOutgoingRequests.length }}
                            </p>
                        </DisclosureButton>
                        <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform -translate-y-2 opacity-0"
                            enter-to-class="transform translate-y-0 opacity-100"
                            leave-active-class="transition duration-75 ease-out"
                            leave-from-class="transform translate-y-0 opacity-100"
                            leave-to-class="transform -translate-y-2 opacity-0"
                        >
                            <DisclosurePanel
                                :class="[
                                    'w-full',
                                    userStore.getIncomingRequests.length
                                        ? 'mt-1'
                                        : '',
                                ]"
                            >
                                <FriendUser
                                    v-for="incomingRequest in userStore.getOutgoingRequests"
                                    :username="incomingRequest.username"
                                    :id="incomingRequest.id"
                                    type="Outgoing"
                                />
                            </DisclosurePanel>
                        </transition>
                    </Disclosure>
                </TabPanel>
                <TabPanel class="focus:outline-none">
                    <p class="text-slate-600 mb-2">
                        {{ $t("friendPage.friendAdded") }}
                    </p>
                    <form @submit.prevent="sendFriendRequest">
                        <div class="w-full flex rounded-md bg-gray-200">
                            <input
                                @input="setFriendUsername"
                                :value="friendUsername"
                                :disabled="isRequestSending"
                                class="disabled:opacity-60 w-full py-2 pl-2 outline-none bg-transparent text-slate-800"
                                :placeholder="$t('friendPage.enterUsername')"
                            />
                            <button
                                :disabled="
                                    isRequestSending || !friendUsername.trim()
                                "
                                class="disabled:cursor-not-allowed disabled:opacity-70 shrink-0 w-32 h-10 text-center transition flex items-center justify-center leading-none bg-emerald-500 hover:opacity-80 rounded-md m-2"
                            >
                                <Spinner
                                    class="w-6 h-6"
                                    v-if="isRequestSending"
                                />
                                <span v-else>{{
                                    $t("friendPage.sendRequest")
                                }}</span>
                            </button>
                        </div>
                        <p
                            v-if="sendFriendRequestError"
                            class="text-rose-400 mt-2"
                        >
                            {{ sendFriendRequestError }}
                        </p>
                    </form>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    </div>
</template>
<script setup>
import FriendUser from "@/components/friends/User.vue";
import Spinner from "@/components/icons/Spinner.vue";

import { useChatsStore } from "@/stores/chats";
import { useUserStore } from "@/stores/user";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import { useTitle } from "@vueuse/core";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const chatsStore = useChatsStore();
const toast = useToast();
useTitle("Friends");

const friendUsername = ref("");
const sendFriendRequestError = ref("");
const isRequestSending = ref(false);

const sendFriendRequest = async () => {
    isRequestSending.value = true;
    const response = await userStore.sendFriendRequest(
        friendUsername.value.trim()
    );
    isRequestSending.value = false;

    if (response.ok) return toast.success(response.ok);
    sendFriendRequestError.value = response;
};

const setFriendUsername = (e) => {
    friendUsername.value = e.target.value;
    sendFriendRequestError.value = "";
};
</script>
