import { CustomIoAdapter } from "@/adapters/socketio-admin";
import { AppModule } from "@/app.module";
import {
    BadRequestException,
    HttpStatus,
    ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );
    const config = app.get<ConfigService>(ConfigService);
    const logger = app.get(Logger);
    const customIoAdapter = new CustomIoAdapter(app);

    await app.register(require("@fastify/cookie"));
    await app.register(require("@fastify/helmet"));
    await app.register(require("@fastify/csrf-protection"));
    await app.register(require("@fastify/multipart"));

    app.enableCors({
        origin: config.get("corsOrigins") as string[],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            exceptionFactory: (validationErrors) => {
                const errors: any = {};
                validationErrors.forEach((err) => {
                    errors[err.property] = Object.values(
                        err.constraints as any
                    );
                });
                logger.warn({
                    event: `input_validation_fail,${Object.keys(errors)}`,
                    msg: "User submitted data that failed validation.",
                });
                return new BadRequestException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: {
                        validationError: errors,
                    },
                });
            },
        })
    );
    app.useLogger(logger);
    app.useWebSocketAdapter(customIoAdapter);

    await app.listen(config.get("port") as number, "0.0.0.0", () => {
        logger.log("Server is listening on port:" + config.get("port"));
    });
}
bootstrap();
