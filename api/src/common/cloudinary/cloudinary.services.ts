import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CLDService {
    cld;
    constructor(private config: ConfigService) {
        this.cld = v2.config({
            cloud_name: this.config.get("cldName") || "",
            api_key: this.config.get("cldApiKey") || "",
            api_secret: this.config.get("cldApiSecret") || "",
        });
    }

    async uploadImage(
        file: Buffer,
        folder: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                {
                    folder,
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result);
                }
            );
            const stream = Readable.from(file);
            stream.pipe(upload);
        });
    }
}
