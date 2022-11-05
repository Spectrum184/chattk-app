import formatAxiosError from "@/utils/formatAxiosError";
import { api } from "@/utils/axios";
import axios from "axios";

async function saveMessage(chatId, ackId, content) {
    api.post(`/chat/${chatId}/messages`, { content, ackId })
        .then((res) => res.data)
        .catch((e) => {
            throw e;
        });
}

async function getMessage(chatId) {
    return api.get(`/chat/${chatId}/messages?limit=50`).then((res) => res.data);
}

async function loadMessageBeforeId(messageId, chatId) {
    return api
        .get(`/chat/${chatId}/messages?before=${messageId}&limit=50`)
        .then((res) => res.data);
}

export { saveMessage, getMessage, loadMessageBeforeId };
