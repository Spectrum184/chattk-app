import ChatLayout from "@/layouts/ChatLayout.vue";
import ChatPage from "@/views/chat/ChatPage.vue";
import FriendsPage from "@/views/friends/FriendsPage.vue";
import HomeView from "@/views/IndexPage.vue";
import ProfilePage from "@/views/user/ProfilePage.vue";

export const routes = [
    {
        path: "/",
        name: "homeContainer",
        component: ChatLayout,
        children: [
            {
                path: "",
                name: "home",
                component: HomeView,
            },
            {
                path: "/m/:id",
                name: "chat",
                component: ChatPage,
                meta: {
                    auth: true,
                },
            },
            {
                path: "/friends",
                name: "friends",
                component: FriendsPage,
                meta: {
                    auth: true,
                },
            },
            {
                path: "/profile/:username",
                name: "profile",
                component: ProfilePage,
                meta: {
                    auth: true,
                },
            },
        ],
    },
];
