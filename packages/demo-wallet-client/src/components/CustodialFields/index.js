import { useState, useEffect } from "react";
import { Checkbox, Input } from "@stellar/design-system";
import { useDispatch } from "react-redux";
import { Memo, StrKey, Keypair } from "stellar-sdk";
import { updateCustodialAction, resetCustodialAction } from "ducks/custodial";
import "./styles.scss";
export const CustodialFields = ({ isValid, }) => {
    const [isCustodialMode, setIsCustodialMode] = useState(false);
    const [secretKeyValue, setSecretKeyValue] = useState("");
    const [memoIdValue, setMemoIdValue] = useState("");
    const [errorSecretKey, setErrorSecretKey] = useState("");
    const [errorMemoId, setErrorMemoId] = useState("");
    const dispatch = useDispatch();
    const isInputsValid = !!secretKeyValue && !errorSecretKey && !!memoIdValue && !errorMemoId;
    useEffect(() => {
        if (isCustodialMode) {
            isValid(isInputsValid);
        }
        else {
            isValid(true);
        }
    }, [isCustodialMode, isInputsValid, isValid]);
    useEffect(() => {
        if (isCustodialMode) {
            dispatch(updateCustodialAction({
                isEnabled: true,
            }));
        }
        else {
            dispatch(resetCustodialAction());
        }
    }, [isCustodialMode, dispatch]);
    const resetLocalState = () => {
        setIsCustodialMode(false);
        setSecretKeyValue("");
        setMemoIdValue("");
        setErrorSecretKey("");
        setErrorMemoId("");
    };
    const handleCustodialModeChange = () => {
        if (isCustodialMode) {
            resetLocalState();
        }
        setIsCustodialMode(!isCustodialMode);
    };
    const validateSecretKey = (value) => {
        setErrorSecretKey("");
        const isSecretKeyValid = StrKey.isValidEd25519SecretSeed(value);
        if (isSecretKeyValid) {
            dispatch(updateCustodialAction({
                secretKey: value,
                publicKey: Keypair.fromSecret(value).publicKey(),
            }));
        }
        else {
            setErrorSecretKey("Secret key is not valid");
        }
    };
    const validateMemoId = (value) => {
        setErrorMemoId("");
        try {
            const memoId = Memo.id(value);
            dispatch(updateCustodialAction({
                memoId: memoId.value,
            }));
        }
        catch (e) {
            setErrorMemoId("Memo ID must be a valid 64 bit unsigned integer");
        }
    };
    return (React.createElement("div", { className: "CustodialFields" },
        React.createElement(Checkbox, { id: "custodialMode", label: "Custodial mode", onChange: handleCustodialModeChange }),
        isCustodialMode ? (React.createElement("div", { className: "CustodialFields__container" },
            React.createElement(Input, { id: "custodialSecretKey", label: "Custodial secret key", placeholder: "Starts with S, example: SCHK\u2026ZLJK", onBlur: (e) => {
                    setSecretKeyValue(e.target.value);
                    validateSecretKey(e.target.value);
                }, error: errorSecretKey }),
            React.createElement(Input, { id: "custodialMemoId", label: "Custodial Memo ID", onBlur: (e) => {
                    setMemoIdValue(e.target.value);
                    validateMemoId(e.target.value);
                }, error: errorMemoId }))) : null));
};
//# sourceMappingURL=index.js.map