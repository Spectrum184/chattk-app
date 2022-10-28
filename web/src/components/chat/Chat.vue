<template>
    <RouterLink
        :to="{ name: 'chat', params: { id: chatId } }"
        @click="chatClicked"
    >
        <User
            :name="name"
            :online="online"
            :class="[
                'hover:cursor-pointer text-slate-800',
                isOpen ? 'md:bg-gray-300' : 'hover:bg-gray-200',
            ]"
            :nameEllipsis="true"
        >
            <template #content-top-right>
                <p class="text-sm whitespace-nowrap text-slate-700 ml-auto">
                    {{ formattedTime }}
                </p>
            </template>
            <template #description>
                <div class="flex text-sm">
                    <p
                        class="text-ellipsis overflow-hidden whitespace-nowrap text-slate-500"
                    >
                        <span class="font-medium">
                            {{ lastMessageFromSelf ? "You:" : "" }}
                        </span>
                        {{ lastMessage }}
                    </p>
                    <div class="ml-auto text-slate-500">
                        <MessageStatus
                            :from-self="lastMessageFromSelf"
                            :sending="lastMessageSending"
                            :error="lastMessageError"
                        />
                    </div>
                </div>
            </template>
        </User>
    </RouterLink>
</template>

<script setup>
import User from "@/components/user/User.vue";
import MessageStatus from "@/components/chat/MessageStatus.vue";
import { useFormatTime } from "@/composables/FormatTime";
import { computed } from "vue";
import { RouterLink } from "vue-router";
const emit = defineEmits(["chatClicked"]);

const props = defineProps([
    "name",
    "lastMessageFromSelf",
    "lastMessage",
    "lastMessageError",
    "hasNewMessages",
    "online",
    "chatId",
    "time",
    "isOpen",
    "lastMessageSending",
]);
const { formattedTime } = useFormatTime(computed(() => props.time));

const chatClicked = () => {
    emit("chatClicked");
};
</script>
