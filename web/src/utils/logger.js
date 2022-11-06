export const logger = {
    ws: {
        info(msg) {
            console.info(`[WS] [INFO] [${new Date().toISOString()}] ${msg}`);
        },
        error(msg) {
            console.error(`[WS] [ERROR] [${new Date().toISOString()}] ${msg}`);
        },
    },
    web: {
        info(msg) {
            console.info(`[WEB] [INFO] [${new Date().toISOString()}]`, msg);
        },
        error(msg) {
            console.error(`[WEB] [ERROR] [${new Date().toISOString()}]`, msg);
        },
    },
};
