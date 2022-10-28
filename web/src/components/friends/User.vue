<template>
    <User
        :online="online"
        :avatar="avatar"
        :name="username"
        class="hover:cursor-pointer hover:bg-gray-300 bg-gray-200 my-2"
        @click="openChat"
    >
        <template #description>
            <p class="text-sm text-slate-800">
                {{ activeStatus }}
            </p>
        </template>
        <template #content-right>
            <div class="ml-auto leading-none flex gap-2 items-center">
                <button
                    :disabled="removeFriendLoading"
                    v-if="type === 'Friend'"
                    class="disabled:cursor-not-allowed transition bg-transparent rounded-full p-2 text-emerald-500 hover:text-emerald-400"
                >
                    <Spinner v-if="openChatLoading" class="w-6 h-6" />
                    <ChatAltIcon v-else class="w-6 h-6" />
                </button>
                <button
                    v-if="type === 'Incoming'"
                    :disabled="
                        acceptFriendRequestLoading || removeFriendLoading
                    "
                    @click.stop="acceptFriendRequest"
                    class="disabled:cursor-not-allowed transition bg-transparent rounded-full p-2 text-emerald-500 hover:text-emerald-400"
                >
                    <Spinner
                        class="w-6 h-6"
                        v-if="acceptFriendRequestLoading"
                    />
                    <CheckCircleIcon v-else class="w-6 h-6" />
                </button>
                <button
                    @click.stop="deleteFriend"
                    :disabled="
                        removeFriendLoading || acceptFriendRequestLoading
                    "
                    class="disabled:cursor-not-allowed transition bg-transparent rounded-full p-2 text-red-500 hover:text-red-400"
                >
                    <spinner v-if="removeFriendLoading" class="w-6 h-6" />
                    <XCircleIcon v-else class="w-6 h-6" />
                </button>
            </div>
            <TransitionRoot
                appear
                :show="isRemoveConfirmationDialogOpen"
                as="template"
            >
                <Dialog
                    as="div"
                    @close="closeRemoveConfirmation"
                    class="relative z-50"
                >
                    <TransitionChild
                        as="template"
                        enter="duration-200 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-100 ease-in"
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
                                enter="duration-200 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-100 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <DialogPanel
                                    class="w-full max-w-md transform overflow-hidden rounded-md bg-gray-200 text-left align-middle shadow-xl transition-all"
                                >
                                    <DialogTitle
                                        as="h3"
                                        class="text-xl font-medium leading-6 text-slate-800 px-4 pt-4"
                                    >
                                        {{ t("remove") }}
                                        <span class="font-semibold">{{
                                            username
                                        }}</span
                                        >?
                                    </DialogTitle>
                                    <div class="mt-2 px-4">
                                        <p class="leading-snug text-slate-700">
                                            {{ t("friendPage.sureRemove") }}
                                            <span class="font-bold">{{
                                                username
                                            }}</span>
                                            {{ t("friendPage.sureRemove2") }}
                                        </p>
                                    </div>

                                    <div
                                        class="mt-4 flex gap-3 justify-end bg-gray-300 p-2"
                                    >
                                        <button
                                            type="button"
                                            :disabled="removeFriendLoading"
                                            class="disabled:cursor-not-allowed disabled:opacity-70 transition py-2 px-4 focus:outline-none rounded-md text-slate-100 hover:bg-gray-600/80"
                                            @click="closeRemoveConfirmation"
                                        >
                                            {{ t("cancel") }}
                                        </button>
                                        <button
                                            type="button"
                                            :disabled="removeFriendLoading"
                                            class="disabled:cursor-not-allowed disabled:opacity-70 w-24 flex items-center justify-center transition transform p-2 focus:outline-none rounded-md text-slate-100 bg-red-500 hover:bg-red-400 hover:text-white"
                                            @click="removeFriend"
                                        >
                                            <Spinner
                                                v-if="removeFriendLoading"
                                                class="w-6 h-6"
                                            />
                                            <span v-else>{{
                                                t("remove")
                                            }}</span>
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </template>
    </User>
</template>
<script setup>
import User from "@/components/user/User.vue";
import Spinner from "@/components/icons/Spinner.vue";
import {
    ChatAltIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/vue/outline";
import { useActiveStatusRef } from "@/composables/ActiveStatus";
import { useUserStore } from "@/stores/user";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from "@headlessui/vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

const props = defineProps([
    "username",
    "avatar",
    "online",
    "id",
    "chatId",
    "type",
]);

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const { activeStatus } = useActiveStatusRef(computed(() => props.online));
const { t } = useI18n({
    inheritLocale: true,
});
const acceptFriendRequestLoading = ref(false);
const openChatLoading = ref(false);
const removeFriendLoading = ref(false);
const isRemoveConfirmationDialogOpen = ref(false);

function closeRemoveConfirmation() {
    if (!removeFriendLoading.value)
        isRemoveConfirmationDialogOpen.value = false;
}
function openRemoveConfirmation() {
    isRemoveConfirmationDialogOpen.value = true;
}

const openChat = async () => {
    if (
        removeFriendLoading.value ||
        acceptFriendRequestLoading.value ||
        openChatLoading.value
    )
        return;
    if (props.chatId)
        return router.push({ name: "chat", params: { id: props.chatId } });
};
const removeFriend = async () => {
    removeFriendLoading.value = true;
    const response = await userStore.removeOrDeclineFriendRequest(props.id);
    removeFriendLoading.value = false;
    if (response.ok) {
        toast.success(response.ok);
    } else toast.error(response);
};
const deleteFriend = async () => {
    if (props.type === "Friend") return openRemoveConfirmation();
    await removeFriend();
};
const acceptFriendRequest = async () => {
    acceptFriendRequestLoading.value = true;
    userStore
        .acceptFriendRequest(props.id)
        .then((msg) => {
            if (msg.ok) toast.success(msg.ok);
            else toast.error(msg);
        })
        .finally(() => (acceptFriendRequestLoading.value = false));
};
</script>
