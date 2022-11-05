import formatAxiosError from "@/utils/formatAxiosError";

export class UserService {
    #api;
    #axios;
    #serverUrl;
    constructor(api, axios, serverUrl) {
        this.#api = api;
        this.#axios = axios;
        this.#serverUrl = serverUrl;
    }

    async login(username, password, friendlyName) {
        return this.#axios
            .post(`${this.#serverUrl}/auth/login`, {
                username,
                password,
                friendlyName,
            })
            .then(() => ({
                ok: true,
            }))
            .catch((e) => formatAxiosError(e));
    }

    async createAccount(username, password, email) {
        return this.#axios
            .post(`${this.#serverUrl}/auth/signup`, {
                username,
                password,
                email,
            })
            .then(() => ({
                ok: true,
            }))
            .catch((e) => formatAxiosError(e));
    }
}
