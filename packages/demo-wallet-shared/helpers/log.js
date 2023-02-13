import { captureMessage as sentryCaptureMessage } from "@sentry/browser";
import { LOG_MESSAGE_EVENT } from "../constants/settings";
import { LogType } from "../types/types";
const dispatchLog = (detail) => {
    document.dispatchEvent(new CustomEvent(LOG_MESSAGE_EVENT, {
        detail,
    }));
};
export const log = {
    request: ({ title, body = "", }) => {
        console.log("🚀", title, body);
        dispatchLog({
            timestamp: new Date().getTime(),
            type: LogType.REQUEST,
            title,
            body,
        });
    },
    response: ({ title, body = "", }) => {
        console.log("✅", title, body);
        dispatchLog({
            timestamp: new Date().getTime(),
            type: LogType.RESPONSE,
            title,
            body,
        });
    },
    instruction: ({ title, body = "", }) => {
        console.info("💬", title, body);
        dispatchLog({
            timestamp: new Date().getTime(),
            type: LogType.INSTRUCTION,
            title,
            body,
        });
    },
    error: ({ title, body = "", }) => {
        sentryCaptureMessage(title);
        console.error(title, body);
        dispatchLog({
            timestamp: new Date().getTime(),
            type: LogType.ERROR,
            title,
            body,
        });
    },
    warning: ({ title, body = "", }) => {
        sentryCaptureMessage(title);
        console.warn(title, body);
        dispatchLog({
            timestamp: new Date().getTime(),
            type: LogType.WARNING,
            title,
            body,
        });
    },
};
//# sourceMappingURL=log.js.map