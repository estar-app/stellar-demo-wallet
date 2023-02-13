import { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "@stellar/design-system";
import { AccountInfo } from "components/AccountInfo";
import { Assets } from "components/Assets";
import { SendPayment } from "components/SendPayment";
import { Sep6Deposit } from "components/Sep6/Sep6Deposit";
import { Sep6Withdraw } from "components/Sep6/Sep6Withdraw";
import { Sep8Send } from "components/Sep8Send";
import { Sep31Send } from "components/Sep31Send";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { resetActiveAssetAction } from "ducks/activeAsset";
import { useRedux } from "hooks/useRedux";
export const Account = () => {
    var _a;
    const { account } = useRedux("account");
    const [sendPaymentModalVisible, setSendPaymentModalVisible] = useState(false);
    const [currentAsset, setCurrentAsset] = useState();
    const dispatch = useDispatch();
    const handleCloseModal = () => {
        setSendPaymentModalVisible(false);
        dispatch(resetActiveAssetAction());
    };
    const handleSendPayment = (asset) => {
        setCurrentAsset(asset);
        setSendPaymentModalVisible(true);
    };
    if (!((_a = account.data) === null || _a === void 0 ? void 0 : _a.id)) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(AccountInfo, null),
        React.createElement(Assets, { onSendPayment: handleSendPayment }),
        React.createElement(Sep6Deposit, null),
        React.createElement(Sep6Withdraw, null),
        React.createElement(Sep8Send, null),
        React.createElement(Sep31Send, null),
        React.createElement(Modal, { visible: Boolean(sendPaymentModalVisible), onClose: handleCloseModal, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(SendPayment, { asset: currentAsset, onClose: handleCloseModal }))));
};
//# sourceMappingURL=Account.js.map