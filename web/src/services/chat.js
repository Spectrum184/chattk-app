import { api } from "@/utils/axios";

async function openChat(recipientId) {
    return api
        .post(`/chat/${recipientId}?type=user`)
        .then((res) => res.data)
        .catch((e) => {
            throw e;
        });
}

export { openChat };
