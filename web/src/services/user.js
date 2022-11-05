import formatAxiosError from "@/utils/formatAxiosError";
import { api } from "@/utils/axios";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function login(username, password, friendlyName) {
    return axios
        .post(`${SERVER_URL}/auth/login`, {
            username,
            password,
            friendlyName,
        })
        .then((res) => res.data)
        .catch((e) => {
            throw formatAxiosError(e);
        });
}

async function createAccount(username, password, email) {
    return axios
        .post(`${SERVER_URL}/auth/signup`, {
            username,
            password,
            email,
        })
        .then((res) => res.data)
        .catch((e) => {
            throw formatAxiosError(e);
        });
}

async function acceptFriendRequest(id) {
    return api
        .put(`/users/${id}/friend?type=id`)
        .then((res) => res.data)
        .catch((e) => {
            throw formatAxiosError(e);
        });
}

async function sendFriendRequest(username) {
    return api
        .put(`/users/${username}/friend`)
        .then((res) => res.data)
        .catch((e) => {
            throw formatAxiosError(e);
        });
}

async function removeOrDeclineFriendRequest(id) {
    return api
        .delete(`/users/${id}/friend`)
        .then((res) => res.data)
        .catch((e) => {
            throw formatAxiosError(e);
        });
}

async function getUserInfo(username) {
    return api
        .get(`/user-info/${username}`)
        .then((res) => res.data)
        .catch((e) => {
            throw formatAxiosError(e);
        });
}

export {
    login,
    createAccount,
    acceptFriendRequest,
    sendFriendRequest,
    removeOrDeclineFriendRequest,
    getUserInfo,
};
