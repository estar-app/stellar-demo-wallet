import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input, Modal } from "@stellar/design-system";
import { ErrorMessage } from "components/ErrorMessage";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { initiateSep8SendAction, sep8ReviseTransactionAction, sep8SendActionRequiredFieldsAction, } from "ducks/sep8Send";
import { Sep9FieldType, } from "demo-wallet-shared/build/helpers/Sep9Fields";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, Sep8ActionRequiredResultType, Sep8Step, } from "types/types.d";
export const Sep8ActionRequiredForm = ({ onClose, }) => {
    const { account, sep8Send } = useRedux("account", "sep8Send");
    const [fieldValues, setFieldValues] = useState({});
    const { actionFields, message, actionMethod, actionUrl } = sep8Send.data.actionRequiredInfo;
    const { nextUrl, result } = sep8Send.data.actionRequiredResult;
    const dispatch = useDispatch();
    useEffect(() => {
        var _a;
        const shouldOpenActionUrl = actionMethod === "GET";
        if (shouldOpenActionUrl ||
            sep8Send.data.sep8Step === Sep8Step.SENT_ACTION_REQUIRED_FIELDS) {
            if (shouldOpenActionUrl) {
                window.open(actionUrl, "_blank");
            }
            if (nextUrl && result === Sep8ActionRequiredResultType.FOLLOW_NEXT_URL) {
                window.open(nextUrl, "_blank");
                if (account.data) {
                    dispatch(initiateSep8SendAction({
                        assetCode: sep8Send.data.assetCode,
                        assetIssuer: sep8Send.data.assetIssuer,
                        homeDomain: sep8Send.data.homeDomain,
                    }));
                }
            }
            if (account.data &&
                result === Sep8ActionRequiredResultType.NO_FURTHER_ACTION_REQUIRED) {
                const params = {
                    destination: sep8Send.data.revisedTransaction.destination,
                    isDestinationFunded: true,
                    amount: sep8Send.data.revisedTransaction.amount,
                    assetCode: sep8Send.data.assetCode,
                    assetIssuer: sep8Send.data.assetIssuer,
                    publicKey: (_a = account.data) === null || _a === void 0 ? void 0 : _a.id,
                    approvalServer: sep8Send.data.approvalServer,
                };
                dispatch(sep8ReviseTransactionAction(params));
            }
        }
    }, [
        actionMethod,
        actionUrl,
        account.data,
        dispatch,
        nextUrl,
        result,
        sep8Send.data.approvalServer,
        sep8Send.data.assetCode,
        sep8Send.data.assetIssuer,
        sep8Send.data.homeDomain,
        sep8Send.data.revisedTransaction.amount,
        sep8Send.data.revisedTransaction.destination,
        sep8Send.data.sep8Step,
    ]);
    const handleSubmitActionRequiredFields = () => {
        dispatch(sep8SendActionRequiredFieldsAction({
            actionFields: fieldValues,
            actionMethod,
            actionUrl,
        }));
    };
    const handleOnChangeField = ({ fieldName, event, }) => {
        const files = event.target.files;
        const fieldValue = (files === null || files === void 0 ? void 0 : files.length) ? files[0] : event.target.value;
        const buffFieldValue = { ...fieldValues };
        buffFieldValue[fieldName] = fieldValue;
        setFieldValues(buffFieldValue);
    };
    const getInputParams = ({ sep9Field }) => {
        const { name: fieldName, type: fieldType } = sep9Field;
        let inputValue = {
            value: fieldValues[fieldName] || "",
        };
        let inputType = "text";
        switch (fieldType) {
            case Sep9FieldType.DATE:
                inputType = "date";
                break;
            case Sep9FieldType.BINARY:
                inputType = "file";
                inputValue = {};
                break;
            case Sep9FieldType.NUMBER:
                inputType = "number";
                break;
            default:
                break;
        }
        if (fieldName === "email_address") {
            inputType = "email";
        }
        return { inputType, inputValue };
    };
    const renderSendPayment = () => (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "SEP-8 Action Required"),
        React.createElement(Modal.Body, null,
            React.createElement("div", { className: "ModalMessage" },
                React.createElement("p", null, message)),
            React.createElement("div", { className: "ModalMessage" },
                React.createElement("p", null, "The following information is needed before we can proceed:")), actionFields === null || actionFields === void 0 ? void 0 :
            actionFields.map((sep9Field) => {
                const { name: fieldName, description } = sep9Field;
                const { inputType, inputValue } = getInputParams({ sep9Field });
                return (React.createElement(Input, { key: fieldName, id: `sep8-action-field-${fieldName}`, type: inputType, label: fieldName, onChange: (event) => handleOnChangeField({ fieldName, event }), multiple: false, note: description, ...inputValue }));
            }),
            React.createElement(ErrorMessage, { message: sep8Send.errorString })),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSubmitActionRequiredFields, isLoading: sep8Send.status === ActionStatus.PENDING }, "Submit"))));
    return (React.createElement(Modal, { onClose: onClose, visible: true, parentId: CSS_MODAL_PARENT_ID }, renderSendPayment()));
};
//# sourceMappingURL=Sep8ActionRequiredForm.js.map