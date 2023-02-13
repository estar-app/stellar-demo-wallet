import { useState } from "react";
import { Layout, Modal } from "@stellar/design-system";
import { SignOutModal } from "components/SignOutModal";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { useRedux } from "hooks/useRedux";
export const Header = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { account } = useRedux("account");
    const handleCloseModal = () => {
        setModalVisible(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Layout.Header, { projectTitle: "Demo Wallet", ...(account.isAuthenticated
                ? { onSignOut: () => setModalVisible(true) }
                : {}), hasDarkModeToggle: true }),
        React.createElement(Modal, { visible: modalVisible, onClose: handleCloseModal, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(SignOutModal, { onClose: handleCloseModal }))));
};
//# sourceMappingURL=Header.js.map