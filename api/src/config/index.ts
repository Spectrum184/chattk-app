export function validate(config: Record<string, any>) {
    const requiredProperties: string[] = [];
    const errors: string[] = [];
    requiredProperties.forEach((property: string) => {
        if (!config[property] || !config[property].trim()) {
            errors.push(property);
        }
    });

    if (config.NODE_ENV !== "production") {
        config.CORS_ALLOWED_DOMAINS
            ? (config.CORS_ALLOWED_DOMAINS +=
                  " http://localhost:5173 http://192.168.11.28 http://192.168.11.4:5173 http://localhost:3000")
            : (config.CORS_ALLOWED_DOMAINS =
                  "http://localhost:5173 http://192.168.11.28 http://192.168.11.4:5173 http://localhost:3000");
    }

    if (errors.length) {
        throw new Error(
            `Error: Missing the following REQUIRED environment variables: ${errors.join(
                " | "
            )}`
        );
    }
    return config;
}
export const config = () => {
    return {
        sessionMaxAge:
            Number(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 24 * 14, // 2 weeks
        db: {
            name: process.env.DB_NAME || "chattk_db",
            uri: process.env.DB_URI || "mongodb://localhost:27017",
        },
        socketioAdmin: {
            username: process.env.SOCKETIO_ADMIN_USERNAME,
            password: process.env.SOCKETIO_ADMIN_PASSWORD_HASH,
            enabled:
                process.env.SOCKETIO_ADMIN_USERNAME &&
                process.env.SOCKETIO_ADMIN_PASSWORD_HASH,
        },
        redis: {
            uri: process.env.REDIS_URI || "redis://localhost:6379",
        },
        logLevel: process.env.LOG_LEVEL || "info",
        disableRequestLogging: !!process.env.DISABLE_REQUEST_LOGGING || false,
        port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        trustProxy: !!process.env.TRUST_PROXY,
        corsOrigins: process.env.CORS_ALLOWED_DOMAINS?.split(" ") || [],
        bcryptRounds: process.env.BCRYPT_ROUNDS
            ? parseInt(process.env.BCRYPT_ROUNDS)
            : 10,
        disableSignup: !!process.env.DISABLE_SIGNUP,
    };
};
