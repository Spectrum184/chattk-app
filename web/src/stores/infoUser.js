import { userService } from "@/services";
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
            return userService
                .getUserInfo(username)
                .then((data) => this.initData(data))
                .catch((e) => {
                    this.initData({
                        username: "",
                    });
                    return e;
                });
        },
        clearUserInfo() {
            this.userInfo = null;
            this.initialized = false;
        },
        saveUserInfo: async function (info) {
            return userService
                .saveUserInfo(info)
                .then((data) => {
                    this.userInfo = {
                        ...data,
                        username: this.userInfo.username,
                        isUpdated: true,
                    };

                    return { ok: true };
                })
                .catch((e) => e);
        },
    },
});
