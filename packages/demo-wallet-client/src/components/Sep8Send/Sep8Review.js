import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TransactionBuilder } from "stellar-sdk";
import { Button, Checkbox, Modal, Heading3 } from "@stellar/design-system";
import { ErrorMessage } from "components/ErrorMessage";
import { Json } from "components/Json";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { fetchAccountAction } from "ducks/account";
import { sep8SubmitRevisedTransactionAction } from "ducks/sep8Send";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, Sep8Step } from "types/types.d";
export const Sep8Review = ({ onClose }) => {
    var _a;
    const { account, sep8Send } = useRedux("account", "sep8Send");
    const [submittedTx, setSubmittedTx] = useState();
    const [revisedTx, setRevisedTx] = useState();
    const [isApproved, setIsApproved] = useState(false);
    const dispatch = useDispatch();
    const { revisedTxXdr, submittedTxXdr } = sep8Send.data.revisedTransaction;
    const { sep8Step } = sep8Send.data;
    const handleSubmitPayment = () => {
        if (revisedTxXdr && isApproved) {
            dispatch(sep8SubmitRevisedTransactionAction());
        }
    };
    useEffect(() => {
        var _a;
        if (sep8Step === Sep8Step.COMPLETE && ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id)) {
            dispatch(fetchAccountAction({
                publicKey: account.data.id,
                secretKey: account.secretKey,
            }));
            onClose();
        }
    }, [(_a = account.data) === null || _a === void 0 ? void 0 : _a.id, account.secretKey, dispatch, onClose, sep8Step]);
    useEffect(() => {
        const networkPassphrase = getNetworkConfig().network;
        if (submittedTxXdr) {
            const tx = TransactionBuilder.fromXDR(submittedTxXdr, networkPassphrase);
            setSubmittedTx(tx);
        }
        if (revisedTxXdr) {
            const tx = TransactionBuilder.fromXDR(revisedTxXdr, networkPassphrase);
            setRevisedTx(tx);
        }
    }, [revisedTxXdr, submittedTxXdr]);
    const renderSendPayment = () => (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Review & Submit SEP-8 Transaction"),
        React.createElement(Modal.Body, null,
            React.createElement("div", { className: "ModalMessage" },
                React.createElement("p", null,
                    sep8Send.data.actionRequiredResult.result &&
                        "KYC has been approved. ",
                    "Please review the updated operations before submitting your SEP-8 payment.")),
            (submittedTx === null || submittedTx === void 0 ? void 0 : submittedTx.operations) && (React.createElement(React.Fragment, null,
                React.createElement(Heading3, null, "Original transaction operations"),
                React.createElement(Json, { src: submittedTx.operations }))),
            (revisedTx === null || revisedTx === void 0 ? void 0 : revisedTx.operations) && (React.createElement(React.Fragment, null,
                React.createElement(Heading3, null, "Revised transaction operations"),
                React.createElement(Json, { src: revisedTx.operations }))),
            React.createElement(ErrorMessage, { marginBottom: "1rem", message: sep8Send.errorString }),
            React.createElement(Checkbox, { id: "sep8-send-approve", label: "I approve executing these operations.", checked: isApproved, onChange: () => {
                    setIsApproved(!isApproved);
                }, disabled: sep8Send.status === ActionStatus.PENDING })),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSubmitPayment, disabled: !isApproved, isLoading: sep8Send.status === ActionStatus.PENDING }, "Submit"))));
    return (React.createElement(Modal, { onClose: onClose, visible: true, parentId: CSS_MODAL_PARENT_ID }, renderSendPayment()));
};
//# sourceMappingURL=Sep8Review.js.map