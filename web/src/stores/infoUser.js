import { api } from "@/utils/axios";
import formatAxiosError from "@/utils/formatAxiosError";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore({
    id: "userInfo",
    state: () => ({
        userInfo: null,
        initialized: false,
    }),
    getters: {
        getUserInfo: (state) => state.userInfo,
        getInitialized: (state) => state.initialized,
        getCanUpdated: (state) => (username) =>
            state.userInfo?.username === username,
    },
    actions: {
        initData(userInfo, initialized = true) {
            this.userInfo = userInfo;
            this.initialized = initialized;
        },
        setUserInfo: async function (username) {
            return api
                .get(`${import.meta.env.VITE_API_URL}/user-info/${username}`)
                .then((res) => {
                    this.initData(res.data);
                })
                .catch((e) => {
                    this.initData({
                        username: "",
                    });
                    return formatAxiosError(e);
                });
        },
        clearUserInfo() {
            this.userInfo = null;
            this.initialized = false;
        },
        saveUserInfo: async function (info) {},
    },
});
