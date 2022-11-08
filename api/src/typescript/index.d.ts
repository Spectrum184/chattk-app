import { UserNoProfile } from "@/models/user.model";
import { FastifyRequest } from "fastify";

declare module "fastify" {
    interface FastifyRequest {
        user: UserNoProfile & {
            sessionName?: string | undefined;
            sessionId: string;
        };
        file: () => Promise<FileStream>;
    }
}

declare module "socket.io" {
    interface Socket {
        user: { id: string };
    }
}
