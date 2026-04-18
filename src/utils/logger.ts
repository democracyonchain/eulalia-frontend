import { isDev } from "./env";

export const logger = {
    log: (...args: any[]) => {
        if (isDev) console.log(...args);
    },
    error: (...args: any[]) => {
        if (isDev) console.error(...args);
    },
    warn: (...args: any[]) => {
        if (isDev) console.warn(...args);
    },
    info: (...args: any[]) => {
        if (isDev) console.info(...args);
    },
};

export default logger;
