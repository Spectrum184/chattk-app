import { ulid } from "ulid";
import { User, UserNoProfile } from "@/models/user.model";
import { UsersService } from "@/users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid/async";
import { ConfigService } from "@nestjs/config";
import { SessionDoc } from "@/models/session.model";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AuthError, HttpMessage } from "./auth.constants";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private authRepository: AuthRepository,
        private config: ConfigService,
        @InjectPinoLogger(AuthService.name)
        private logger: PinoLogger
    ) {}

    async validateUser(
        username: string,
        password: string
    ): Promise<UserNoProfile> {
        const user = await this.userService.findOneNoProfileByName(username);
        if (!user) {
            this.logger.warn({
                event: `authn_login_fail:${username}`,
                msg: `Non-existent user account login attempted.`,
            });
            throw new UnauthorizedException(HttpMessage.userNotFound);
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            this.logger.warn({
                event: `authn_login_fail:${user.id}`,
                msg: "User attempted to log in using an incorrect password.",
            });
            throw new UnauthorizedException(HttpMessage.wrongInfo);
        }

        return user;
    }

    async validateToken(token: string, returnFullUser?: boolean) {
        const result = await this.findOneByToken(token, returnFullUser);
        if (result === AuthError.sessionNotFound) {
            this.logger.warn({
                event: "session_invalid,session_not_found",
                msg: "User attempted to access a protected route without being logged in.",
            });
            throw new UnauthorizedException(HttpMessage.invalidSession);
        } else if (result === AuthError.userNotFound) {
            this.logger.warn({
                event: "session_invalid,user_not_found",
                msg: "User attempted to access a protected route without being logged in.",
            });
            throw new UnauthorizedException(HttpMessage.invalidSession);
        } else {
            this.touchSession(result.sessionId);
            return result;
        }
    }

    async findOneByToken(
        token: string,
        returnFullUser?: boolean
    ): Promise<
        | (User & { sessionName?: string | undefined; sessionId: string })
        | AuthError.sessionNotFound
        | AuthError.userNotFound
    > {
        const session = await this.authRepository.findOneSession(token);
        if (!session) return AuthError.sessionNotFound;
        const user = returnFullUser
            ? await this.userService.findOneById(session.userId)
            : await this.userService.findOneNoProfileById(session.userId);
        if (!user) return AuthError.userNotFound;

        return { ...user, sessionName: session.name, sessionId: session._id };
    }

    async createSession(
        userId: string,
        name?: string
    ): Promise<{ id: string; token: string }> {
        const token = await nanoid(50);
        const id = ulid();
        const doc: SessionDoc = {
            _id: id,
            userId,
            expiresAt: new Date(
                (Date.now() + this.config.get("sessionMaxAge")) as number
            ),
            token,
        };
        if (name) doc.name = name;
        await this.authRepository.insertSession(doc);
        return { id, token };
    }

    touchSession(sessionId: string) {
        return this.authRepository.touchSession(
            sessionId,
            this.config.get("sessionMaxAge") as number
        );
    }

    deleteSession(sessionId: string) {
        return this.authRepository.deleteSession(sessionId);
    }
}
