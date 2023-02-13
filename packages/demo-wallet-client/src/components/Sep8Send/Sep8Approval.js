import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StrKey } from "stellar-sdk";
import { Button, InfoBlock, Input, TextLink, Modal, } from "@stellar/design-system";
import { DataProvider } from "@stellar/wallet-sdk";
import { ErrorMessage } from "components/ErrorMessage";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { sep8ClearErrorAction, sep8ReviseTransactionAction, } from "ducks/sep8Send";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, Sep8Step } from "types/types.d";
export const Sep8Approval = ({ onClose }) => {
    const { account, sep8Send } = useRedux("account", "sep8Send");
    const { approvalCriteria, approvalServer, assetCode, assetIssuer } = sep8Send.data;
    const [amount, setAmount] = useState(sep8Send.data.revisedTransaction.amount);
    const [destination, setDestination] = useState(sep8Send.data.revisedTransaction.destination);
    const [isDestinationFunded, setIsDestinationFunded] = useState(true);
    const dispatch = useDispatch();
    const resetFormState = () => {
        setDestination("");
        setAmount("");
        setIsDestinationFunded(true);
    };
    useEffect(() => {
        if (sep8Send.data.sep8Step === Sep8Step.PENDING) {
            onClose();
        }
    }, [onClose, sep8Send.data.sep8Step]);
    const handleSubmitPayment = () => {
        var _a, _b;
        if ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id) {
            const params = {
                destination,
                isDestinationFunded,
                amount,
                assetCode,
                assetIssuer,
                publicKey: (_b = account.data) === null || _b === void 0 ? void 0 : _b.id,
                approvalServer,
            };
            dispatch(sep8ReviseTransactionAction(params));
        }
    };
    const handleCloseModal = () => {
        resetFormState();
        onClose();
    };
    const checkAndSetIsDestinationFunded = async () => {
        if (!destination || !StrKey.isValidEd25519PublicKey(destination)) {
            return;
        }
        const dataProvider = new DataProvider({
            serverUrl: getNetworkConfig().url,
            accountOrKey: destination,
            networkPassphrase: getNetworkConfig().network,
        });
        setIsDestinationFunded(await dataProvider.isAccountFunded());
    };
    const renderApprovePayment = () => (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Send SEP-8 Payment"),
        React.createElement(Modal.Body, null,
            React.createElement(Input, { id: "send-destination", label: "Destination", value: destination, onChange: (e) => {
                    setDestination(e.target.value);
                    if (sep8Send.errorString) {
                        dispatch(sep8ClearErrorAction());
                    }
                }, onBlur: checkAndSetIsDestinationFunded }),
            React.createElement(Input, { id: "send-amount", label: "Amount", type: "number", value: amount, onChange: (e) => {
                    setAmount(e.target.value);
                    if (sep8Send.errorString) {
                        dispatch(sep8ClearErrorAction());
                    }
                } }),
            React.createElement(Input, { id: "send-asset-code", label: "Asset code", value: assetCode, disabled: true }),
            React.createElement(Input, { id: "send-asset-issuer", label: "Asset issuer", value: assetIssuer, disabled: true }),
            React.createElement(InfoBlock, null,
                React.createElement("strong", null, "Approval criteria: "),
                approvalCriteria),
            !isDestinationFunded && (React.createElement(InfoBlock, null,
                "The destination account doesn\u2019t exist. A create account operation will be used to create this account.",
                " ",
                React.createElement(TextLink, { href: "https://developers.stellar.org/docs/tutorials/create-account/" }, "Learn more about account creation"))),
            React.createElement(ErrorMessage, { message: sep8Send.errorString })),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSubmitPayment, isLoading: sep8Send.status === ActionStatus.PENDING }, "Submit"))));
    return (React.createElement(Modal, { onClose: handleCloseModal, visible: true, parentId: CSS_MODAL_PARENT_ID }, renderApprovePayment()));
};
//# sourceMappingURL=Sep8Approval.js.map