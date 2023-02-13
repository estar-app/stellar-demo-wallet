import { useState } from "react";
import { TextLink, Layout, Modal } from "@stellar/design-system";
import { ConfigurationModal } from "components/ConfigurationModal";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { useRedux } from "hooks/useRedux";
export const Footer = () => {
    const [configModalVisible, setConfigModalVisible] = useState(false);
    const { account } = useRedux("account");
    const handleConfigModalClose = () => {
        setConfigModalVisible(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Layout.Footer, { gitHubLink: "https://github.com/stellar/stellar-demo-wallet", hideTopBorder: true }, account.isAuthenticated && (React.createElement("div", null,
            React.createElement(TextLink, { onClick: () => setConfigModalVisible(true) }, "Configuration")))),
        React.createElement(Modal, { visible: configModalVisible, onClose: handleConfigModalClose, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(ConfigurationModal, { onClose: handleConfigModalClose }))));
};
//# sourceMappingURL=Footer.js.map