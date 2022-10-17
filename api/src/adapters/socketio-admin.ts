import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";

export class CustomIoAdapter extends IoAdapter {
    constructor(private app: NestFastifyApplication) {
        super(app);
    }
    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options) as Server;
        const config = this.app.get<ConfigService>(ConfigService);

        if (config.get("socketioAdmin.enabled")) {
            instrument(server, {
                auth: {
                    type: "basic",
                    username: config.get("socketioAdmin.username") as string,
                    password: config.get("socketioAdmin.password") as string,
                },
            });
        }

        return server;
    }
}
