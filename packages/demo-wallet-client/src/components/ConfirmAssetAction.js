import { useState } from "react";
import { Button, Modal } from "@stellar/design-system";
import { useRedux } from "hooks/useRedux";
import { CustodialFields } from "components/CustodialFields";
export const ConfirmAssetAction = ({ onClose }) => {
    const { activeAsset } = useRedux("activeAsset");
    const [isCustodialFieldsValid, setIsCustodialFieldsValid] = useState(true);
    if (!(activeAsset === null || activeAsset === void 0 ? void 0 : activeAsset.action)) {
        return null;
    }
    const { title, description, callback, options, showCustodial } = activeAsset.action;
    const isStartDisabled = showCustodial && !isCustodialFieldsValid;
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, title),
        React.createElement(Modal.Body, null,
            description &&
                (typeof description === "string" ? (React.createElement("p", null, description)) : (description)),
            options ? React.createElement("p", null, options) : null,
            showCustodial ? (React.createElement(CustodialFields, { isValid: (isValid) => setIsCustodialFieldsValid(isValid) })) : null),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: () => {
                    callback();
                }, disabled: isStartDisabled }, "Start"),
            React.createElement(Button, { variant: Button.variant.secondary, onClick: onClose }, "Cancel"))));
};
//# sourceMappingURL=ConfirmAssetAction.js.map