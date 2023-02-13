import React from "react";
import "./styles.scss";
export const ErrorMessage = ({ message, marginTop = "0", marginBottom = "0", textAlign = "left", }) => {
    if (!message) {
        return null;
    }
    return (React.createElement("div", { className: "ErrorMessage", style: { marginTop, marginBottom, textAlign } }, message));
};
//# sourceMappingURL=index.js.map