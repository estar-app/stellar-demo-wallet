import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Layout } from "@stellar/design-system";
import "./styles.scss";
export const ToastBanner = ({ parentId, visible, children, }) => {
    const parent = document.getElementById(parentId);
    const [isVisible, setIsVisible] = useState(visible);
    const [isFadeReady, setIsFadeReady] = useState(false);
    useLayoutEffect(() => {
        if (visible) {
            setIsVisible(true);
            setTimeout(() => {
                setIsFadeReady(true);
            }, 150);
        }
        else {
            const t = setTimeout(() => {
                setIsFadeReady(false);
                clearTimeout(t);
                setTimeout(() => {
                    setIsVisible(false);
                }, 400);
            }, 600);
        }
    }, [visible]);
    if (!parent || !isVisible) {
        return null;
    }
    return ReactDOM.createPortal(React.createElement("div", { className: `ToastBanner ${isFadeReady ? "open" : ""}` },
        React.createElement(Layout.Inset, null, children)), parent);
};
//# sourceMappingURL=index.js.map