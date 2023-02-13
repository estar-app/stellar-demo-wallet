import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input, Select, TextLink, Modal, Heading3, DetailsTooltip, } from "@stellar/design-system";
import { ErrorMessage } from "components/ErrorMessage";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { resetActiveAssetAction } from "ducks/activeAsset";
import { resetSep6WithdrawAction, submitSep6WithdrawFields, sep6WithdrawAction, } from "ducks/sep6WithdrawAsset";
import { useRedux } from "hooks/useRedux";
import { shortenStellarKey } from "demo-wallet-shared/build/helpers/shortenStellarKey";
import { ActionStatus } from "types/types.d";
export const Sep6Withdraw = () => {
    var _a, _b;
    const { sep6WithdrawAsset } = useRedux("sep6WithdrawAsset");
    const { data: { assetCode, transactionResponse, withdrawResponse }, } = sep6WithdrawAsset;
    const formInitialState = {
        withdrawType: {
            type: "",
        },
        customerFields: {},
        infoFields: {},
    };
    const [formData, setFormData] = useState(formInitialState);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const dispatch = useDispatch();
    const withdrawTypes = useMemo(() => { var _a; return ((_a = sep6WithdrawAsset.data.withdrawTypes) === null || _a === void 0 ? void 0 : _a.types) || { fields: {} }; }, [sep6WithdrawAsset]);
    const [activeWithdrawType, setActiveWithdrawType] = useState(Object.keys(withdrawTypes)[0]);
    const withdrawTypesArr = useMemo(() => Object.entries(withdrawTypes), [withdrawTypes]);
    useEffect(() => {
        if (sep6WithdrawAsset.status === ActionStatus.NEEDS_INPUT) {
            const initialWithdrawType = withdrawTypesArr[0][0];
            setFormData({
                withdrawType: {
                    type: initialWithdrawType,
                },
                customerFields: {},
                infoFields: {},
            });
            setActiveWithdrawType(initialWithdrawType);
        }
    }, [sep6WithdrawAsset.status, withdrawTypesArr, dispatch]);
    const resetLocalState = () => {
        setFormData(formInitialState);
    };
    const handleClose = () => {
        dispatch(resetSep6WithdrawAction());
        dispatch(resetActiveAssetAction());
        resetLocalState();
    };
    const handleWithdrawTypeChange = (event) => {
        const { value } = event.target;
        setActiveWithdrawType(value);
        setFormData({
            ...formData,
            withdrawType: {
                type: value,
            },
        });
    };
    const handleInfoFieldChange = (event) => {
        const { id, value } = event.target;
        const updatedState = {
            ...formData,
            infoFields: {
                ...formData.infoFields,
                [id]: value,
            },
        };
        setFormData(updatedState);
    };
    const handleCustomerFieldChange = (event) => {
        const { id, value } = event.target;
        const updatedState = {
            ...formData,
            customerFields: {
                ...formData.customerFields,
                [id]: value,
            },
        };
        setFormData(updatedState);
    };
    const handleFieldsSubmit = (event) => {
        event.preventDefault();
        dispatch(submitSep6WithdrawFields({ ...formData }));
    };
    const handleAmountFieldChange = (event) => {
        const { value } = event.target;
        setWithdrawAmount(value);
    };
    const handleAmountSubmit = (event) => {
        event.preventDefault();
        dispatch(sep6WithdrawAction(withdrawAmount));
    };
    if (sep6WithdrawAsset.status === ActionStatus.NEEDS_INPUT) {
        return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(Modal.Heading, null, "SEP-6 Withdrawal Info"),
            React.createElement(Modal.Body, null,
                React.createElement(Heading3, null,
                    React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                            "These are the fields the receiving anchor requires. The sending client obtains them from the /info endpoint.",
                            " ",
                            React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md#info" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                        React.createElement(React.Fragment, null, "SEP-6 Required Info"))),
                React.createElement("div", { className: "vertical-spacing" },
                    React.createElement(Select, { label: "Withdrawal Type", id: "withdrawal-type", onChange: handleWithdrawTypeChange }, withdrawTypesArr.map(([type]) => (React.createElement("option", { key: type, value: type }, type)))),
                    Object.entries(((_a = withdrawTypes[activeWithdrawType]) === null || _a === void 0 ? void 0 : _a.fields) || {}).map(([field, fieldInfo]) => (React.createElement(Input, { key: field, id: field, label: fieldInfo === null || fieldInfo === void 0 ? void 0 : fieldInfo.description, required: true, onChange: handleInfoFieldChange })))),
                Object.keys(sep6WithdrawAsset.data.fields).length ? (React.createElement(Heading3, null,
                    React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                            "These are the fields the receiving anchor requires. The sending client obtains them from the /customer endpoint.",
                            " ",
                            React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-get" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                        React.createElement(React.Fragment, null, "SEP-12 Required Info")))) : null,
                React.createElement("div", { className: "vertical-spacing" }, Object.entries(sep6WithdrawAsset.data.fields || {}).map(([field, fieldInfo]) => (React.createElement(Input, { key: field, id: field, label: fieldInfo === null || fieldInfo === void 0 ? void 0 : fieldInfo.description, required: true, onChange: handleCustomerFieldChange })))),
                React.createElement(ErrorMessage, { message: sep6WithdrawAsset.errorString })),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { onClick: handleFieldsSubmit }, "Submit"))));
    }
    if (sep6WithdrawAsset.status === ActionStatus.CAN_PROCEED) {
        return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(Modal.Heading, null, "Payment Sending"),
            React.createElement(Modal.Body, null,
                React.createElement("div", { className: "vertical-spacing" },
                    React.createElement("strong", null, "Sending Payment To: "),
                    shortenStellarKey(withdrawResponse.account_id)),
                React.createElement(Input, { id: "withdraw-amount", label: "Amount to Withdraw", required: true, onChange: handleAmountFieldChange }),
                withdrawResponse.min_amount || withdrawResponse.max_amount ? (React.createElement("div", { className: "vertical-spacing" },
                    withdrawResponse.min_amount && (React.createElement("p", null,
                        React.createElement("strong", null, "Min Amount: "),
                        withdrawResponse.min_amount)),
                    withdrawResponse.max_amount && (React.createElement("p", null,
                        React.createElement("strong", null, "Max Amount: "),
                        withdrawResponse.max_amount)))) : null,
                withdrawResponse.id && (React.createElement("div", { className: "vertical-spacing" },
                    React.createElement("strong", null, "Transaction ID: "),
                    withdrawResponse.id)),
                ((_b = withdrawResponse.extra_info) === null || _b === void 0 ? void 0 : _b.message) && (React.createElement("div", { className: "vertical-spacing" }, withdrawResponse.extra_info.message)),
                withdrawResponse.memo_type && (React.createElement("div", { className: "vertical-spacing" },
                    React.createElement("strong", null, "Memo Type: "),
                    withdrawResponse.memo_type)),
                withdrawResponse.memo && (React.createElement("div", { className: "vertical-spacing" },
                    React.createElement("strong", null, "Memo: "),
                    withdrawResponse.memo))),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { onClick: handleAmountSubmit }, "Submit"))));
    }
    if (sep6WithdrawAsset.status === ActionStatus.SUCCESS) {
        return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(Modal.Heading, null, "SEP-6 Withdrawal Completed"),
            React.createElement(Modal.Body, null,
                transactionResponse.to && (React.createElement("div", { className: "vertical-spacing" },
                    React.createElement("strong", null, "Account Withdrawn To: "),
                    React.createElement("p", null, transactionResponse.to),
                    React.createElement("p", null, transactionResponse.external_extra_text))),
                transactionResponse.more_info_url && (React.createElement("div", { className: "vertical-spacing" },
                    React.createElement("strong", null, "More Info: "),
                    React.createElement("p", null, transactionResponse.more_info_url))),
                transactionResponse.amount_in && (React.createElement("div", { className: "vertical-spacing" },
                    "Amount Withdrawn: ",
                    transactionResponse.amount_in,
                    React.createElement("p", null, transactionResponse.amount_fee && (React.createElement(React.Fragment, null,
                        "Fee: ",
                        transactionResponse.amount_fee))),
                    React.createElement("p", null, transactionResponse.amount_out && (React.createElement("strong", null,
                        "Total Amount Out: ",
                        transactionResponse.amount_out,
                        " ",
                        assetCode))))))));
    }
    return null;
};
//# sourceMappingURL=Sep6Withdraw.js.map