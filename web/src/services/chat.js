export class ChatService {
    #api;
    #serverUrl;
    constructor(api, serverUrl) {
        this.#api = api;
        this.#serverUrl = serverUrl;
    }

    async openChat(recipientId) {
        return this.#api
            .post(`${this.#serverUrl}/chat/${recipientId}?type=user`)
            .then((res) => res.data)
            .catch((e) => e);
    }
}
