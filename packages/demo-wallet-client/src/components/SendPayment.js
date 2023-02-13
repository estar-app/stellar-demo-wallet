import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, InfoBlock, Input, TextLink, Modal, } from "@stellar/design-system";
import { DataProvider } from "@stellar/wallet-sdk";
import { StrKey } from "stellar-sdk";
import { ErrorMessage } from "components/ErrorMessage";
import { fetchAccountAction } from "ducks/account";
import { resetActiveAssetAction } from "ducks/activeAsset";
import { sendPaymentAction, resetSendPaymentAction } from "ducks/sendPayment";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AssetType } from "types/types.d";
export const SendPayment = ({ asset, onClose, }) => {
    const { account, sendPayment } = useRedux("account", "sendPayment");
    const { data, secretKey } = account;
    const dispatch = useDispatch();
    const [destination, setDestination] = useState("");
    const [amount, setAmount] = useState("");
    const [assetCode, setAssetCode] = useState(asset === null || asset === void 0 ? void 0 : asset.assetCode);
    const [assetIssuer, setAssetIssuer] = useState((asset === null || asset === void 0 ? void 0 : asset.assetIssuer) || "");
    const [isDestinationFunded, setIsDestinationFunded] = useState(true);
    const resetFormState = () => {
        setDestination("");
        setAmount("");
        setAssetCode("");
        setAssetIssuer("");
        setIsDestinationFunded(true);
    };
    useEffect(() => () => {
        dispatch(resetSendPaymentAction());
        dispatch(resetActiveAssetAction());
        resetFormState();
    }, [dispatch]);
    useEffect(() => {
        if (sendPayment.status === ActionStatus.SUCCESS && (data === null || data === void 0 ? void 0 : data.id)) {
            dispatch(fetchAccountAction({
                publicKey: data.id,
                secretKey,
            }));
            dispatch(resetSendPaymentAction());
            dispatch(resetActiveAssetAction());
            resetFormState();
            onClose();
        }
    }, [sendPayment.status, secretKey, data === null || data === void 0 ? void 0 : data.id, dispatch, onClose]);
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
    const handleSubmit = () => {
        if (data === null || data === void 0 ? void 0 : data.id) {
            const params = {
                destination,
                isDestinationFunded,
                amount,
                assetCode,
                assetIssuer,
                publicKey: data.id,
            };
            dispatch(sendPaymentAction(params));
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Send payment"),
        React.createElement(Modal.Body, null,
            React.createElement(Input, { id: "send-destination", label: "Destination", value: destination, onChange: (e) => setDestination(e.target.value), onBlur: () => {
                    checkAndSetIsDestinationFunded();
                } }),
            React.createElement(Input, { id: "send-amount", label: "Amount", type: "number", value: amount, onChange: (e) => setAmount(e.target.value) }),
            React.createElement(Input, { id: "send-asset-code", label: "Asset code", value: assetCode, onChange: (e) => setAssetCode(e.target.value) }),
            (asset === null || asset === void 0 ? void 0 : asset.assetType) !== AssetType.NATIVE && (React.createElement(Input, { id: "send-asset-issuer", label: "Asset issuer", value: assetIssuer, onChange: (e) => setAssetIssuer(e.target.value) })),
            !isDestinationFunded && (React.createElement(InfoBlock, null,
                "The destination account doesn\u2019t exist. A create account operation will be used to create this account.",
                " ",
                React.createElement(TextLink, { href: "https://developers.stellar.org/docs/tutorials/create-account/" }, "Learn more about account creation"))),
            React.createElement(ErrorMessage, { message: sendPayment.errorString })),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSubmit, isLoading: sendPayment.status === ActionStatus.PENDING }, "Submit"))));
};
//# sourceMappingURL=SendPayment.js.map