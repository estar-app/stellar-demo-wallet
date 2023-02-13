import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Input, TextLink, Modal, RadioButton, Heading3, DetailsTooltip, } from "@stellar/design-system";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { fetchAccountAction } from "ducks/account";
import { resetActiveAssetAction } from "ducks/activeAsset";
import { resetSep31SendAction, submitSep31SendTransactionAction, setCustomerTypesAction, fetchSendFieldsAction, } from "ducks/sep31Send";
import { capitalizeString } from "demo-wallet-shared/build/helpers/capitalizeString";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types.d";
var CustomerType;
(function (CustomerType) {
    CustomerType["SENDER"] = "sender";
    CustomerType["RECEIVER"] = "receiver";
})(CustomerType || (CustomerType = {}));
export const Sep31Send = () => {
    var _a;
    const { account, sep31Send } = useRedux("account", "sep31Send");
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [customerTypes, setCustomerTypes] = useState({
        sender: "",
        receiver: "",
    });
    const { data } = sep31Send;
    const dispatch = useDispatch();
    useEffect(() => {
        var _a;
        if (sep31Send.status === ActionStatus.CAN_PROCEED) {
            if (sep31Send.data.isTypeSelected) {
                dispatch(fetchSendFieldsAction());
            }
        }
        if (sep31Send.status === ActionStatus.SUCCESS) {
            if ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id) {
                resetLocalState();
                dispatch(fetchAccountAction({
                    publicKey: account.data.id,
                    secretKey: account.secretKey,
                }));
                dispatch(resetSep31SendAction());
            }
        }
    }, [
        sep31Send.status,
        sep31Send.data.isTypeSelected,
        (_a = account.data) === null || _a === void 0 ? void 0 : _a.id,
        account.secretKey,
        dispatch,
    ]);
    const resetLocalState = () => {
        setErrorMessage("");
        setCustomerTypesAction({ senderType: "", receiverType: "" });
        setFormData({});
    };
    const handleChange = (event) => {
        const { id, value } = event.target;
        const [section, field] = id.split("#");
        const updatedState = {
            ...formData,
            [section]: {
                ...(formData[section] || {}),
                [field]: value,
            },
        };
        setFormData(updatedState);
    };
    const handleTypeChange = (type, typeId) => {
        const updatedTypes = {
            ...customerTypes,
            [type]: typeId,
        };
        setCustomerTypes(updatedTypes);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(submitSep31SendTransactionAction({ ...formData }));
    };
    const handleSelectTypes = (event) => {
        var _a, _b;
        setErrorMessage("");
        const { sender, receiver } = customerTypes;
        event.preventDefault();
        if ((((_a = data.multipleSenderTypes) === null || _a === void 0 ? void 0 : _a.length) && !sender) ||
            (((_b = data.multipleReceiverTypes) === null || _b === void 0 ? void 0 : _b.length) && !receiver)) {
            setErrorMessage("Please select sender/receiver type");
            return;
        }
        dispatch(setCustomerTypesAction({
            senderType: sender !== null && sender !== void 0 ? sender : data.senderType,
            receiverType: receiver !== null && receiver !== void 0 ? receiver : data.receiverType,
        }));
    };
    const handleClose = () => {
        resetLocalState();
        dispatch(resetSep31SendAction());
        dispatch(resetActiveAssetAction());
    };
    const renderSenderOptions = () => {
        var _a, _b;
        if (data.senderType) {
            return (React.createElement("p", null,
                React.createElement("code", null, data.senderType),
                " was automatically selected"));
        }
        if (!data.senderType && !((_a = data.multipleSenderTypes) === null || _a === void 0 ? void 0 : _a.length)) {
            return React.createElement("p", null, "Sender type is not required");
        }
        return (_b = data.multipleSenderTypes) === null || _b === void 0 ? void 0 : _b.map((sender) => (React.createElement(RadioButton, { onChange: () => handleTypeChange(CustomerType.SENDER, sender.type), key: sender.type, id: sender.type, value: sender.type, name: "customer-sender", label: React.createElement("span", { className: "inline-block" },
                React.createElement("code", null, sender.type),
                " ",
                sender.description) })));
    };
    const renderReceiverOptions = () => {
        var _a, _b;
        if (data.receiverType) {
            return (React.createElement("p", null,
                React.createElement("code", null, data.receiverType),
                " was automatically selected"));
        }
        if (!data.receiverType && !((_a = data.multipleReceiverTypes) === null || _a === void 0 ? void 0 : _a.length)) {
            return React.createElement("p", null, "Receiver type is not required");
        }
        return (_b = data.multipleReceiverTypes) === null || _b === void 0 ? void 0 : _b.map((receiver) => (React.createElement(RadioButton, { onChange: () => handleTypeChange(CustomerType.RECEIVER, receiver.type), key: receiver.type, id: receiver.type, value: receiver.type, name: "customer-receiver", label: React.createElement("span", { className: "inline-block" },
                React.createElement("code", null, receiver.type),
                " ",
                receiver.description) })));
    };
    if (sep31Send.status === ActionStatus.NEEDS_INPUT) {
        if (!data.isTypeSelected) {
            return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
                React.createElement(Modal.Heading, null, "Customer Types"),
                React.createElement(Modal.Body, null,
                    React.createElement("p", null, "Receiving anchors are required to collect Know Your Customer (KYC) information on the customers involved in a transaction. Each type described below corresponds to a different set of KYC values the anchor will request the sending anchor to provide. This demo wallet, which acts as a sending anchor, will provide you a form to enter the fields corresponding to the type selected."),
                    React.createElement("div", null,
                        React.createElement(Heading3, null, "Sender"),
                        renderSenderOptions()),
                    React.createElement("div", null,
                        React.createElement(Heading3, null, "Receiver"),
                        renderReceiverOptions()),
                    errorMessage && React.createElement("p", { className: "error" }, errorMessage)),
                React.createElement(Modal.Footer, null,
                    React.createElement(Button, { onClick: handleSelectTypes }, "Submit"))));
        }
        if (data.isTypeSelected) {
            const { transaction, sender, receiver } = data.fields;
            const allFields = {
                amount: {
                    amount: {
                        description: "amount to send",
                    },
                },
                ...(sender ? { sender } : {}),
                ...(receiver ? { receiver } : {}),
                ...(transaction ? { transaction } : {}),
            };
            return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
                React.createElement(Modal.Heading, null,
                    React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                            "These are the fields the receiving anchor requires. The sending client obtains them from the /customer endpoint.",
                            " ",
                            React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-get" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                        React.createElement(React.Fragment, null, "Sender and receiver info"))),
                React.createElement(Modal.Body, null, Object.entries(allFields).map(([sectionTitle, sectionItems]) => (React.createElement("div", { className: "vertical-spacing", key: sectionTitle },
                    React.createElement(Heading3, null, capitalizeString(sectionTitle)),
                    Object.entries(sectionItems || {}).map(([id, input]) => (React.createElement(Input, { key: `${sectionTitle}#${id}`, id: `${sectionTitle}#${id}`, label: input.description, required: !input.optional, onChange: handleChange }))))))),
                React.createElement(Modal.Footer, null,
                    React.createElement(Button, { onClick: handleSubmit }, "Submit"))));
        }
    }
    return null;
};
//# sourceMappingURL=Sep31Send.js.map