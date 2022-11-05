import { api } from "@/utils/axios";
import axios from "axios";

import { ChatService } from "./chat";
import { UserService } from "./user";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const chatService = new ChatService(api, SERVER_URL);
export const userService = new UserService(api, axios, SERVER_URL);
