import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Heading2, Loader, TextLink, Layout, CopyText, DetailsTooltip, } from "@stellar/design-system";
import { Json } from "components/Json";
import { ToastBanner } from "components/ToastBanner";
import { fetchAccountAction, fundTestnetAccount } from "ducks/account";
import { fetchClaimableBalancesAction } from "ducks/claimableBalances";
import { shortenStellarKey } from "demo-wallet-shared/build/helpers/shortenStellarKey";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types.d";
export const AccountInfo = () => {
    var _a, _b;
    const { account } = useRedux("account");
    const [isAccountDetailsVisible, setIsAccountDetailsVisible] = useState(false);
    const dispatch = useDispatch();
    const handleRefreshAccount = useCallback(() => {
        var _a;
        if ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id) {
            dispatch(fetchAccountAction({
                publicKey: account.data.id,
                secretKey: account.secretKey,
            }));
            dispatch(fetchClaimableBalancesAction({ publicKey: account.data.id }));
        }
    }, [(_a = account.data) === null || _a === void 0 ? void 0 : _a.id, account.secretKey, dispatch]);
    const handleCreateAccount = () => {
        var _a;
        if ((_a = account.data) === null || _a === void 0 ? void 0 : _a.id) {
            dispatch(fundTestnetAccount(account.data.id));
        }
    };
    if (!((_b = account.data) === null || _b === void 0 ? void 0 : _b.id)) {
        return null;
    }
    const isPending = account.status === ActionStatus.PENDING;
    return (React.createElement(Layout.Inset, null,
        React.createElement("div", { className: "Account" },
            React.createElement("div", { className: "AccountInfo" },
                React.createElement("div", { className: "AccountInfoRow" },
                    React.createElement("div", { className: "AccountInfoCell AccountLabel" }, "Public"),
                    React.createElement("div", { className: "AccountInfoCell" }, shortenStellarKey(account.data.id)),
                    React.createElement("div", { className: "AccountInfoCell CopyButton" },
                        React.createElement(CopyText, { textToCopy: account.data.id },
                            React.createElement(TextLink, null, "Copy")))),
                React.createElement("div", { className: "AccountInfoRow" },
                    React.createElement("div", { className: "AccountInfoCell AccountLabel" }, "Secret"),
                    React.createElement("div", { className: "AccountInfoCell" }, shortenStellarKey(account.secretKey)),
                    React.createElement("div", { className: "AccountInfoCell CopyButton" },
                        React.createElement(CopyText, { textToCopy: account.secretKey },
                            React.createElement(TextLink, null, "Copy"))))),
            React.createElement("div", { className: "AccountInfo" },
                React.createElement("div", { className: "AccountInfoRow" },
                    React.createElement("div", { className: "AccountInfoCell" },
                        account.isUnfunded && (React.createElement("div", { className: "InfoButtonWrapper" },
                            React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                                    "Clicking create will fund your test account with XLM. If you\u2019re testing SEP-24 you may want to leave this account unfunded.",
                                    " ",
                                    React.createElement(TextLink, { href: "https://developers.stellar.org/docs/tutorials/create-account/#create-account" }, "Learn more")) },
                                React.createElement(TextLink, { onClick: handleCreateAccount, disabled: isPending }, "Create account")))),
                        !account.isUnfunded && (React.createElement(TextLink, { onClick: () => setIsAccountDetailsVisible(!isAccountDetailsVisible) }, `${isAccountDetailsVisible ? "Hide" : "Show"} account details`)))),
                React.createElement("div", { className: "AccountInfoRow" },
                    React.createElement("div", { className: "AccountInfoCell" },
                        React.createElement("div", { className: "InfoButtonWrapper" },
                            React.createElement(DetailsTooltip, { details: "If you performed account actions elsewhere, like in the\n                  Stellar Laboratory, click here to update." },
                                React.createElement(TextLink, { onClick: handleRefreshAccount, disabled: isPending }, "Refresh account"))))))),
        isAccountDetailsVisible && (React.createElement("div", { className: "AccountDetails Section" },
            React.createElement(Heading2, null, "Account details"),
            React.createElement("div", { className: "AccountDetailsContent" },
                React.createElement(Json, { src: account.data })))),
        React.createElement(ToastBanner, { parentId: "app-wrapper", visible: isPending },
            React.createElement("div", { className: "Layout__inline" },
                React.createElement("span", null, "Updating account"),
                React.createElement(Loader, null)))));
};
//# sourceMappingURL=AccountInfo.js.map