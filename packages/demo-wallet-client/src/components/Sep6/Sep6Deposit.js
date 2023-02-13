import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Select, TextLink, Modal, Heading3, Input, DetailsTooltip, } from "@stellar/design-system";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { resetActiveAssetAction } from "ducks/activeAsset";
import { resetSep6DepositAction, submitSep6DepositFields, sep6DepositAction, } from "ducks/sep6DepositAsset";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types.d";
export const Sep6Deposit = () => {
    var _a;
    const { sep6DepositAsset } = useRedux("sep6DepositAsset");
    const { data: { depositResponse }, } = sep6DepositAsset;
    const formInitialState = {
        amount: "",
        depositType: {
            type: "",
        },
        infoFields: {},
        customerFields: {},
    };
    const [formData, setFormData] = useState(formInitialState);
    const dispatch = useDispatch();
    const depositTypeChoices = useMemo(() => { var _a, _b; return ((_b = (_a = sep6DepositAsset.data.infoFields) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.choices) || []; }, [sep6DepositAsset]);
    useEffect(() => {
        if (sep6DepositAsset.status === ActionStatus.NEEDS_INPUT) {
            setFormData({
                amount: "",
                depositType: {
                    type: depositTypeChoices[0],
                },
                infoFields: {},
                customerFields: {},
            });
        }
    }, [sep6DepositAsset.status, depositTypeChoices, dispatch]);
    const resetLocalState = () => {
        setFormData(formInitialState);
    };
    const handleClose = () => {
        dispatch(resetSep6DepositAction());
        dispatch(resetActiveAssetAction());
        resetLocalState();
    };
    const handleDepositTypeChange = (event) => {
        const { id, value } = event.target;
        const updatedState = {
            ...formData,
            depositType: {
                ...formData.depositType,
                [id]: value,
            },
        };
        setFormData(updatedState);
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
    const handleAmountChange = (event) => {
        const { id, value } = event.target;
        const updatedState = {
            ...formData,
            [id]: value.toString(),
        };
        setFormData(updatedState);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(submitSep6DepositFields({ ...formData }));
    };
    const renderMinMaxAmount = () => {
        const { minAmount, maxAmount } = sep6DepositAsset.data;
        if (minAmount === 0 && maxAmount === 0) {
            return null;
        }
        return `Min: ${minAmount} | Max: ${maxAmount}`;
    };
    if (sep6DepositAsset.status === ActionStatus.NEEDS_INPUT) {
        return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(Modal.Heading, null, "SEP-6 Deposit Info"),
            React.createElement(Modal.Body, null,
                React.createElement("div", { className: "vertical-spacing" },
                    React.createElement(Input, { id: "amount", label: React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                                "The amount of the asset the user would like to deposit with the anchor. This field may be necessary for the anchor to determine what KYC information is necessary to collect.",
                                " ",
                                React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md#1-success-no-additional-information-needed" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                            React.createElement(React.Fragment, null, "Amount (optional)")), onChange: handleAmountChange, type: "number", note: renderMinMaxAmount() })),
                React.createElement(Heading3, null,
                    React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                            "These are the fields the receiving anchor requires. The sending client obtains them from the /info endpoint.",
                            " ",
                            React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md#info" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                        React.createElement(React.Fragment, null, "SEP-6 Required Info"))),
                React.createElement("div", { className: "vertical-spacing" }, Object.entries(sep6DepositAsset.data.infoFields || {}).map(([id, input]) => id === "type" ? (React.createElement("div", { key: id },
                    React.createElement(Select, { label: input.description, id: id, key: id, onChange: handleDepositTypeChange }, depositTypeChoices.map((choice) => (React.createElement("option", { key: choice, value: choice }, choice)))))) : (React.createElement(Input, { key: id, id: id, label: input.description, required: true, onChange: handleInfoFieldChange })))),
                Object.keys(sep6DepositAsset.data.customerFields).length ? (React.createElement(Heading3, null,
                    React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                            "These are the fields the receiving anchor requires. The sending client obtains them from the /customer endpoint.",
                            " ",
                            React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-get" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                        React.createElement(React.Fragment, null, "SEP-12 Required Info")))) : null,
                React.createElement("div", { className: "vertical-spacing" }, Object.entries(sep6DepositAsset.data.customerFields || {}).map(([id, input]) => (React.createElement(Input, { key: id, id: id, label: input.description, required: true, onChange: handleCustomerFieldChange }))))),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { onClick: handleSubmit }, "Submit"),
                React.createElement(Button, { onClick: handleClose, variant: Button.variant.secondary }, "Cancel"))));
    }
    if (sep6DepositAsset.status === ActionStatus.CAN_PROCEED) {
        return (React.createElement(Modal, { visible: true, onClose: handleClose, parentId: CSS_MODAL_PARENT_ID },
            React.createElement(Modal.Heading, null, "SEP-6 Deposit Success"),
            React.createElement(Modal.Body, null,
                React.createElement("p", null, depositResponse.how),
                ((_a = depositResponse.extra_info) === null || _a === void 0 ? void 0 : _a.message) && (React.createElement("p", null, depositResponse.extra_info.message))),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { onClick: () => dispatch(sep6DepositAction()) }, "Proceed"),
                React.createElement(Button, { onClick: handleClose, variant: Button.variant.secondary }, "Close"))));
    }
    return null;
};
//# sourceMappingURL=Sep6Deposit.js.map