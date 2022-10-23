import { MONGODB_PROVIDER } from "@/constants";
import { MongoDB } from "@/database/database.interface";
import { SessionDoc, sessionProjection } from "@/models/session.model";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AuthRepository {
    constructor(
        @Inject(MONGODB_PROVIDER)
        private mongo: MongoDB
    ) {}

    touchSession(sessionId: string, sessionMaxAge: number) {
        return this.mongo.sessions.updateOne(
            { _id: sessionId },
            {
                $set: {
                    expiresAt: new Date(Date.now() + sessionMaxAge),
                },
            }
        );
    }

    deleteSession(sessionId: string) {
        return this.mongo.sessions.deleteOne({ _id: sessionId });
    }

    async insertSession(doc: SessionDoc) {
        return await this.mongo.sessions.insertOne(doc);
    }

    async findOneSession(token: string) {
        return await this.mongo.sessions.findOne<SessionDoc>(
            { token: token },
            { projection: sessionProjection }
        );
    }
}
