import { initSocket } from "@/utils/socket";
import { compareString } from "@/utils/utils";
import { defineStore } from "pinia";
import localforage from "localforage";
import platform from "platform";
import { relationStatus, userType } from "@/utils/constants";
import { userService } from "@/services";

export const useUserStore = defineStore({
    id: "user",
    state: () => ({
        auth: {
            user: null,
            initialized: false,
        },
        users: [],
    }),
    getters: {
        getUser: (state) => state.auth.user,
        getUserById: (state) => (userId) =>
            state.users.find((user) => user.id === userId),
        canSendMessageToUser() {
            return (userId) =>
                this.getUserById(userId)?.relationship ===
                relationStatus.Friend;
        },
        getFriends: (state) =>
            state.users
                ?.filter((user) => user.relationship === relationStatus.Friend)
                .sort((a, b) => compareString(a.username, b.username)),
        getIncomingRequests: (state) =>
            state.users
                .filter((user) => user.relationship === relationStatus.Incoming)
                .sort((a, b) => compareString(a.username, b.username)),
        getOutgoingRequests: (state) =>
            state.users
                .filter((user) => user.relationship === relationStatus.Outgoing)
                .sort((a, b) => compareString(a.username, b.username)),
    },
    actions: {
        async login(username, password) {
            let sessionFriendlyName;
            if (platform.name) sessionFriendlyName = platform.name;
            if (platform.os.family)
                sessionFriendlyName += ` on ${platform.os.family} ${
                    platform.os.version ?? ""
                }`;
            return userService
                .login(username, password, sessionFriendlyName?.trim())
                .then(async (data) => {
                    await localforage.setItem("session", data.session);
                    initSocket();
                    /**
                     * this will show the loading spinner instead.
                     * the socket "Ready" event will set the user.
                     */

                    this.setInitialized(false);
                    return { ok: true };
                })
                .catch((e) => e);
        },
        async createAccount(username, password, email) {
            return userService
                .createAccount(username, password, email)
                .then((data) => {
                    return { ok: true };
                })
                .catch((e) => e);
        },
        setUser(user, setInitialized = true) {
            this.auth.user = user;
            this.auth.initialized = setInitialized;
        },
        setInitialized(setInitialized) {
            this.auth.initialized = setInitialized;
        },
        setUsers(users) {
            this.users = users;
        },
        initData({ users, user }) {
            this.setUsers(users);
            this.setUser(user);
        },
        async acceptFriendRequest(id) {
            return userService
                .acceptFriendRequest(id)
                .then((data) => {
                    if (data.type === userType.requestAccepted) {
                        this.setUserRelatedToFriend(id);
                    } else if (data.type === userType.requestSent) {
                        // gonna deal with that 0.000000000000001% that this ever SOMEHOW happens.
                        this.setUserRelatedToOutgoingOrAddUser(
                            id,
                            data.user.username
                        );
                    }
                    return { ok: data.message };
                })
                .catch((e) => e);
        },
        sendFriendRequest: async function (username) {
            return userService
                .sendFriendRequest(username)
                .then((data) => {
                    if (data.type === userType.requestSent) {
                        this.setUserRelatedToOutgoingOrAddUser(
                            data.user.id,
                            data.user.username
                        );
                    } else if (data.type === userType.requestAccepted) {
                        this.setUserRelatedToFriend(data.user.id);
                    }
                    return { ok: data.message };
                })
                .catch((e) => e);
        },
        removeOrDeclineFriendRequest: async function (id) {
            return userService
                .removeOrDeclineFriendRequest(id)
                .then((data) => {
                    this.setUserRelationToNone(id);
                    return { ok: data.message };
                })
                .catch((e) => e);
        },
        updateUser({ id: userId, ...user }) {
            const userIndex = this.users.findIndex((u) => u.id === userId);
            if (userIndex > -1) {
                this.users[userIndex] = { ...this.users[userIndex], ...user };
            } else {
                this.users.push({ id: userId, ...user });
            }
        },
        setUserRelatedToOutgoingOrAddUser(id, username) {
            const userExists = !!this.users.find((user) => user.id === id);
            if (userExists) {
                this.users = this.users.map((user) => {
                    if (user.id === id) {
                        user.relationship = relationStatus.Outgoing;
                    }
                    return user;
                });
            } else {
                this.users.push({
                    id: id,
                    username: username,
                    relationship: relationStatus.Outgoing,
                });
            }
        },
        setUserRelatedToIncomingOrAddUser(id, username) {
            const userExists = !!this.users.find((user) => user.id === id);
            if (userExists) {
                this.users = this.users.map((user) => {
                    if (user.id === id) {
                        user.relationship = relationStatus.Incoming;
                    }
                    return user;
                });
            } else {
                this.users.push({
                    id: id,
                    username: username,
                    relationship: relationStatus.Incoming,
                });
            }
        },
        setUserRelatedToFriend(id) {
            this.users = this.users.map((user) => {
                if (user.id === id) {
                    user.relationship = relationStatus.Friend;
                }
                return user;
            });
        },
        setUserRelationToNone(id) {
            this.users = this.users.map((user) => {
                if (user.id === id) {
                    user.relationship = relationStatus.None;
                }
                return user;
            });
        },
        clearData() {
            this.setUser(null);
            this.setUsers([]);
        },
    },
});
