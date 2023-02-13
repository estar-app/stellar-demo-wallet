import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Heading2, Loader, TextLink, Modal, Layout, } from "@stellar/design-system";
import { AddAsset } from "components/AddAsset";
import { AddPresetAsset } from "components/AddPresetAsset";
import { Balance } from "components/Balance";
import { ClaimableBalance } from "components/ClaimableBalance";
import { ConfirmAssetAction } from "components/ConfirmAssetAction";
import { ToastBanner } from "components/ToastBanner";
import { UntrustedBalance } from "components/UntrustedBalance";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { fetchAccountAction, resetAccountStatusAction } from "ducks/account";
import { setActiveAssetAction, setActiveAssetStatusAction, resetActiveAssetAction, } from "ducks/activeAsset";
import { getAllAssetsAction, resetAllAssetsStatusAction, } from "ducks/allAssets";
import { addAssetOverridesAction, resetAssetOverridesStatusAction, } from "ducks/assetOverrides";
import { resetClaimAssetAction } from "ducks/claimAsset";
import { fetchClaimableBalancesAction } from "ducks/claimableBalances";
import { resetSep24DepositAssetAction } from "ducks/sep24DepositAsset";
import { resetTrustAssetAction } from "ducks/trustAsset";
import { removeUntrustedAssetAction, resetUntrustedAssetStatusAction, } from "ducks/untrustedAssets";
import { resetSep24WithdrawAssetAction } from "ducks/sep24WithdrawAsset";
import { resetCustodialAction } from "ducks/custodial";
import { getPresetAssets } from "demo-wallet-shared/build/helpers/getPresetAssets";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, SearchParams, TransactionStatus, } from "types/types.d";
export const Assets = ({ onSendPayment, }) => {
    var _a, _b, _c;
    const { account, activeAsset, allAssets, assetOverrides, claimAsset, sep6DepositAsset, sep6WithdrawAsset, sep24DepositAsset, sep24WithdrawAsset, sep31Send, settings, trustAsset, untrustedAssets, } = useRedux("account", "activeAsset", "allAssets", "assetOverrides", "claimAsset", "sep6DepositAsset", "sep6WithdrawAsset", "sep24DepositAsset", "sep24WithdrawAsset", "sep31Send", "settings", "trustAsset", "untrustedAssets");
    const [activeModal, setActiveModal] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let ModalType;
    (function (ModalType) {
        ModalType["ADD_ASSET"] = "ADD_ASSET";
        ModalType["ADD_PRESET_ASSET"] = "ADD_PRESET_ASSET";
        ModalType["CONFIRM_ACTION"] = "CONFIRM_ACTION";
    })(ModalType || (ModalType = {}));
    const handleRemoveUntrustedAsset = useCallback((removeAsset) => {
        if (removeAsset) {
            navigate(searchParam.remove(SearchParams.UNTRUSTED_ASSETS, removeAsset));
            dispatch(removeUntrustedAssetAction(removeAsset));
        }
    }, [dispatch, navigate]);
    const handleRefreshAccount = useCallback(() => {
        var _a;
        if ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id) {
            dispatch(fetchAccountAction({
                publicKey: account.data.id,
                secretKey: account.secretKey,
            }));
        }
    }, [(_a = account.data) === null || _a === void 0 ? void 0 : _a.id, account.secretKey, dispatch]);
    const handleFetchClaimableBalances = useCallback(() => {
        var _a;
        if ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id) {
            dispatch(fetchClaimableBalancesAction({ publicKey: account.data.id }));
        }
    }, [(_b = account.data) === null || _b === void 0 ? void 0 : _b.id, dispatch]);
    const handleCloseModal = () => {
        setActiveModal("");
        dispatch(resetActiveAssetAction());
        dispatch(resetCustodialAction());
    };
    const handleAssetAction = ({ assetString, balance, callback, title, description, options, showCustodial, }) => {
        setActiveModal(ModalType.CONFIRM_ACTION);
        dispatch(setActiveAssetAction({
            assetString,
            title,
            description,
            callback: () => {
                setActiveModal("");
                callback(balance);
            },
            options,
            showCustodial,
        }));
    };
    const setActiveAssetStatusAndToastMessage = useCallback(({ status, message, }) => {
        if (!status) {
            return;
        }
        if (status === ActionStatus.SUCCESS || status === ActionStatus.ERROR) {
            dispatch(resetActiveAssetAction());
            dispatch(resetCustodialAction());
        }
        if (status === ActionStatus.PENDING ||
            status === ActionStatus.NEEDS_INPUT) {
            dispatch(setActiveAssetStatusAction(ActionStatus.PENDING));
            setToastMessage(message);
        }
    }, [dispatch]);
    useEffect(() => {
        if (!activeAsset.action) {
            setToastMessage(undefined);
        }
    }, [activeAsset.action]);
    useEffect(() => {
        if (account.status === ActionStatus.SUCCESS) {
            dispatch(resetAccountStatusAction());
            dispatch(getAllAssetsAction());
        }
    }, [account.status, dispatch]);
    useEffect(() => {
        if (allAssets.status === ActionStatus.SUCCESS) {
            dispatch(resetAllAssetsStatusAction());
        }
    }, [allAssets.status, dispatch]);
    useEffect(() => {
        dispatch(addAssetOverridesAction(settings.assetOverrides));
    }, [settings.assetOverrides, dispatch]);
    useEffect(() => {
        if (assetOverrides.status === ActionStatus.SUCCESS) {
            dispatch(resetAssetOverridesStatusAction());
            dispatch(getAllAssetsAction());
        }
    }, [assetOverrides.status, dispatch]);
    useEffect(() => {
        if (trustAsset.status === ActionStatus.SUCCESS) {
            navigate(searchParam.remove(SearchParams.UNTRUSTED_ASSETS, trustAsset.assetString));
            dispatch(removeUntrustedAssetAction(trustAsset.assetString));
            dispatch(resetTrustAssetAction());
            handleRefreshAccount();
        }
        setActiveAssetStatusAndToastMessage({
            status: trustAsset.status,
            message: "Trust asset in progress",
        });
    }, [
        trustAsset.status,
        trustAsset.assetString,
        handleRefreshAccount,
        setActiveAssetStatusAndToastMessage,
        dispatch,
        navigate,
    ]);
    useEffect(() => {
        if (sep6DepositAsset.status === ActionStatus.SUCCESS &&
            sep6DepositAsset.data.trustedAssetAdded) {
            handleRemoveUntrustedAsset(sep6DepositAsset.data.trustedAssetAdded);
        }
        if (sep6DepositAsset.data.currentStatus === TransactionStatus.COMPLETED) {
            handleRefreshAccount();
            handleFetchClaimableBalances();
        }
        setActiveAssetStatusAndToastMessage({
            status: sep6DepositAsset.status,
            message: "SEP-6 deposit in progress",
        });
    }, [
        sep6DepositAsset.status,
        sep6DepositAsset.data.currentStatus,
        sep6DepositAsset.data.trustedAssetAdded,
        handleRefreshAccount,
        handleFetchClaimableBalances,
        handleRemoveUntrustedAsset,
        setActiveAssetStatusAndToastMessage,
    ]);
    useEffect(() => {
        if (sep6WithdrawAsset.status === ActionStatus.SUCCESS &&
            sep6WithdrawAsset.data.currentStatus === TransactionStatus.COMPLETED) {
            handleRefreshAccount();
        }
        setActiveAssetStatusAndToastMessage({
            status: sep6WithdrawAsset.status,
            message: "SEP-6 withdrawal in progress",
        });
    }, [
        sep6WithdrawAsset.status,
        sep6WithdrawAsset.data.currentStatus,
        handleRefreshAccount,
        setActiveAssetStatusAndToastMessage,
    ]);
    useEffect(() => {
        if (sep24DepositAsset.status === ActionStatus.SUCCESS) {
            dispatch(resetSep24DepositAssetAction());
            if (sep24DepositAsset.data.trustedAssetAdded) {
                handleRemoveUntrustedAsset(sep24DepositAsset.data.trustedAssetAdded);
            }
            if (sep24DepositAsset.data.currentStatus === TransactionStatus.COMPLETED) {
                handleRefreshAccount();
                handleFetchClaimableBalances();
            }
        }
        setActiveAssetStatusAndToastMessage({
            status: sep24DepositAsset.status,
            message: "SEP-24 deposit in progress",
        });
    }, [
        sep24DepositAsset.status,
        sep24DepositAsset.data.currentStatus,
        sep24DepositAsset.data.trustedAssetAdded,
        handleRefreshAccount,
        handleFetchClaimableBalances,
        handleRemoveUntrustedAsset,
        setActiveAssetStatusAndToastMessage,
        dispatch,
    ]);
    useEffect(() => {
        if (sep24WithdrawAsset.status === ActionStatus.SUCCESS) {
            dispatch(resetSep24WithdrawAssetAction());
            if (sep24WithdrawAsset.data.currentStatus === TransactionStatus.COMPLETED) {
                handleRefreshAccount();
            }
        }
        setActiveAssetStatusAndToastMessage({
            status: sep24WithdrawAsset.status,
            message: "SEP-24 withdrawal in progress",
        });
    }, [
        sep24WithdrawAsset.status,
        sep24WithdrawAsset.data.currentStatus,
        handleRefreshAccount,
        setActiveAssetStatusAndToastMessage,
        dispatch,
    ]);
    useEffect(() => {
        if (claimAsset.status === ActionStatus.SUCCESS) {
            handleRemoveUntrustedAsset(claimAsset.data.trustedAssetAdded);
            dispatch(resetClaimAssetAction());
            handleRefreshAccount();
            handleFetchClaimableBalances();
        }
        setActiveAssetStatusAndToastMessage({
            status: claimAsset.status,
            message: "Claim asset in progress",
        });
    }, [
        claimAsset.status,
        claimAsset.data.trustedAssetAdded,
        (_c = account.data) === null || _c === void 0 ? void 0 : _c.id,
        handleRefreshAccount,
        handleFetchClaimableBalances,
        handleRemoveUntrustedAsset,
        setActiveAssetStatusAndToastMessage,
        dispatch,
    ]);
    useEffect(() => {
        setActiveAssetStatusAndToastMessage({
            status: sep31Send.status,
            message: "SEP-31 send in progress",
        });
    }, [sep31Send.status, setActiveAssetStatusAndToastMessage]);
    useEffect(() => {
        if (untrustedAssets.status === ActionStatus.SUCCESS ||
            untrustedAssets.status === ActionStatus.ERROR) {
            dispatch(getAllAssetsAction());
            dispatch(resetUntrustedAssetStatusAction());
            dispatch(resetActiveAssetAction());
        }
    }, [untrustedAssets.status, dispatch]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "Section" },
            React.createElement(Layout.Inset, null,
                React.createElement(Heading2, null, "Balances")),
            React.createElement("div", { className: "Balances" },
                React.createElement(Balance, { onSend: onSendPayment, onAssetAction: handleAssetAction }),
                React.createElement(UntrustedBalance, { onAssetAction: handleAssetAction })),
            React.createElement(Layout.Inset, null,
                React.createElement("div", { className: "BalancesButtons" },
                    React.createElement(Button, { onClick: () => setActiveModal(ModalType.ADD_ASSET), disabled: Boolean(activeAsset.action) }, "Add asset"),
                    getPresetAssets(allAssets.data).length > 0 && (React.createElement(TextLink, { onClick: () => setActiveModal(ModalType.ADD_PRESET_ASSET), disabled: Boolean(activeAsset.action) }, "Select from preset assets"))))),
        React.createElement(ClaimableBalance, { onAssetAction: handleAssetAction }),
        React.createElement(Modal, { visible: Boolean(activeModal), onClose: handleCloseModal, parentId: CSS_MODAL_PARENT_ID },
            activeModal === ModalType.CONFIRM_ACTION && (React.createElement(ConfirmAssetAction, { onClose: handleCloseModal })),
            activeModal === ModalType.ADD_ASSET && (React.createElement(AddAsset, { onClose: handleCloseModal })),
            activeModal === ModalType.ADD_PRESET_ASSET && (React.createElement(AddPresetAsset, { onClose: handleCloseModal }))),
        React.createElement(ToastBanner, { parentId: "app-wrapper", visible: Boolean(toastMessage) },
            React.createElement("div", { className: "Layout__inline" },
                React.createElement("div", null, toastMessage),
                React.createElement(Loader, null)))));
};
//# sourceMappingURL=Assets.js.map