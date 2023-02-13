import { useEffect, useState } from "react";
import { marked } from "marked";
import { Icon } from "@stellar/design-system";
import { Json } from "components/Json";
import { sanitizeHtml } from "demo-wallet-shared/build/helpers/sanitizeHtml";
import { LogType } from "types/types.d";
import "./styles.scss";
marked.setOptions({
    gfm: false,
});
const LogItemIcon = {
    instruction: React.createElement(Icon.MessageSquare, null),
    error: React.createElement(Icon.XCircle, null),
    warning: React.createElement(Icon.AlertTriangle, null),
    request: React.createElement(Icon.ArrowRight, null),
    response: React.createElement(Icon.ArrowLeft, null),
};
const theme = {
    light: {
        base00: "var(--pal-background-primary)",
        base01: "var(--pal-background-primary)",
        base02: "var(--pal-background-primary)",
        base03: "var(--pal-text-primary)",
        base04: "var(--pal-text-primary)",
        base05: "var(--pal-text-primary)",
        base06: "var(--pal-text-primary)",
        base07: "var(--pal-text-primary)",
        base08: "var(--pal-text-primary)",
        base09: "var(--pal-text-primary)",
        base0A: "var(--pal-text-primary)",
        base0B: "var(--pal-text-primary)",
        base0C: "var(--pal-text-primary)",
        base0D: "var(--pal-text-primary)",
        base0E: "var(--pal-text-primary)",
        base0F: "var(--pal-text-primary)",
    },
    dark: {
        base00: "var(--pal-example-code)",
        base01: "var(--pal-example-code)",
        base02: "var(--pal-example-code)",
        base03: "var(--pal-brand-primary-on)",
        base04: "var(--pal-brand-primary-on)",
        base05: "var(--pal-brand-primary-on)",
        base06: "var(--pal-brand-primary-on)",
        base07: "var(--pal-brand-primary-on)",
        base08: "var(--pal-brand-primary-on)",
        base09: "var(--pal-brand-primary-on)",
        base0A: "var(--pal-brand-primary-on)",
        base0B: "var(--pal-brand-primary-on)",
        base0C: "var(--pal-brand-primary-on)",
        base0D: "var(--pal-brand-primary-on)",
        base0E: "var(--pal-brand-primary-on)",
        base0F: "var(--pal-brand-primary-on)",
    },
};
export const LogItem = ({ title, variant, body }) => {
    const [isFadeReady, setIsFadeReady] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => {
            setIsFadeReady(true);
            clearTimeout(t);
        }, 150);
    }, []);
    const bodyParsed = body ? JSON.parse(`${body}`) : body;
    return (React.createElement("div", { className: `LogItem LogItem--${variant} ${isFadeReady ? "LogItem--open" : ""}` },
        React.createElement("div", { className: "LogItem__header" },
            React.createElement("div", { className: "LogItem__icon" }, LogItemIcon[variant]),
            React.createElement("div", { className: "LogItem__title" }, sanitizeHtml(marked(title)))),
        bodyParsed && (React.createElement("div", { className: "LogItem__body" }, typeof bodyParsed === "object" ? (React.createElement(Json, { src: bodyParsed, collapseStringsAfterLength: 15, displayDataTypes: false, collapsed: 1, theme: variant === LogType.INSTRUCTION || variant === LogType.ERROR
                ? theme.light
                : theme.dark })) : (bodyParsed)))));
};
//# sourceMappingURL=index.js.map