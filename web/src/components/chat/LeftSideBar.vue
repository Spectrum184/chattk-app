<template>
    <div
        class="fixed md:static shrink-0 h-full w-full md:w-[360px] z-10 flex flex-col border-r shadow-sm"
    >
        <div
            class="h-14 px-2 w-full flex items-center justify-between border-b shrink-0"
        >
            <h2 class="text-xl text-slate-800 font-medium">
                {{ t("chatPage.chat") }}
            </h2>
        </div>
        <div
            class="h-full px-1.5 pt-2 w-full flex flex-col gap-0.5 overflow-y-auto"
        >
            <Chat
                v-for="chat in chatsStore.chatsWithProperData"
                :key="chat.id"
                :name="chat.name"
                :chat-id="chat.id"
                :last-message="chat.lastMessage?.content"
                :last-message-from-self="chat.lastMessage?.fromSelf"
                :last-message-sending="chat.lastMessage?.sending"
                :last-message-error="chat.lastMessage?.error"
                :time="chat.lastMessage?.timestamp"
                :online="chat.online"
                :is-open="chatsStore.currentlyOpenChatId === chat.id"
            />
        </div>
    </div>
</template>
<script setup>
import Chat from "@/components/chat/Chat.vue";
import { useChatsStore } from "@/stores/chats";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
    inheritLocale: true,
});

const chatsStore = useChatsStore();
</script>
