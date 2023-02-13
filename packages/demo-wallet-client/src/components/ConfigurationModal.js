import { useNavigate } from "react-router-dom";
import { Button, Modal, Toggle } from "@stellar/design-system";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { useRedux } from "hooks/useRedux";
import { SearchParams } from "types/types.d";
export const ConfigurationModal = ({ onClose }) => {
    const { settings } = useRedux("settings");
    const navigate = useNavigate();
    const handleClaimableBalanceSupported = () => {
        navigate(searchParam.update(SearchParams.CLAIMABLE_BALANCE_SUPPORTED, (!settings.claimableBalanceSupported).toString()));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Configuration"),
        React.createElement(Modal.Body, null,
            React.createElement("div", { className: "ConfigurationItem" },
                React.createElement("label", { htmlFor: "claimable-balance-supported" }, "Claimable balance supported"),
                React.createElement(Toggle, { id: "claimable-balance-supported", checked: settings.claimableBalanceSupported, onChange: handleClaimableBalanceSupported }))),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: onClose }, "Close"))));
};
//# sourceMappingURL=ConfigurationModal.js.map