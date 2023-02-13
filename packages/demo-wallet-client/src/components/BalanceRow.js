import React, { useEffect, useState } from "react";
import { Select, TextLink, DetailsTooltip } from "@stellar/design-system";
import { HomeDomainOverrideButtons } from "components/HomeDomainOverrideButtons";
import { shortenStellarKey } from "demo-wallet-shared/build/helpers/shortenStellarKey";
import { AssetActionId, AssetType, } from "types/types.d";
export const BalanceRow = ({ activeAction, asset, onAction, children, }) => {
    const { assetString, assetCode, assetIssuer, total, supportedActions, isUntrusted, notExist, homeDomain, } = asset;
    const isActive = (activeAction === null || activeAction === void 0 ? void 0 : activeAction.assetString) === assetString;
    const disabled = Boolean(activeAction);
    const [selectValue, setSelectValue] = useState("");
    useEffect(() => {
        if (!isActive) {
            setSelectValue("");
        }
    }, [isActive]);
    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectValue(value);
        if (onAction) {
            onAction(value, asset);
        }
    };
    const renderActionsSelect = () => {
        var _a, _b, _c;
        if (onAction) {
            if (isUntrusted && ((_a = asset.supportedActions) === null || _a === void 0 ? void 0 : _a.sep8)) {
                return null;
            }
            return (React.createElement("div", { className: "BalanceCellSelect" },
                React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                        "What you can do with an asset (deposit, withdraw, or send) depends on what transactions the anchor supports.",
                        " ",
                        React.createElement(TextLink, { href: "https://developers.stellar.org/docs/anchoring-assets" }, "Learn more")) },
                    React.createElement(Select, { id: `${assetString}-actions`, onChange: handleSelectChange, disabled: disabled, value: selectValue },
                        React.createElement("option", { value: "" }, "Select action"),
                        !isUntrusted && !((_b = asset.supportedActions) === null || _b === void 0 ? void 0 : _b.sep8) && (React.createElement("option", { value: AssetActionId.SEND_PAYMENT }, "Send payment")),
                        (supportedActions === null || supportedActions === void 0 ? void 0 : supportedActions.sep6) && (React.createElement(React.Fragment, null,
                            React.createElement("option", { value: AssetActionId.SEP6_DEPOSIT }, "SEP-6 Deposit"),
                            !isUntrusted && (React.createElement("option", { value: AssetActionId.SEP6_WITHDRAW }, "SEP-6 Withdraw")))),
                        !isUntrusted && ((_c = asset.supportedActions) === null || _c === void 0 ? void 0 : _c.sep8) && (React.createElement("option", { value: AssetActionId.SEP8_SEND_PAYMENT }, "SEP-8 Send")),
                        (supportedActions === null || supportedActions === void 0 ? void 0 : supportedActions.sep24) && (React.createElement(React.Fragment, null,
                            React.createElement("option", { value: AssetActionId.SEP24_DEPOSIT }, "SEP-24 Deposit"),
                            !isUntrusted && (React.createElement("option", { value: AssetActionId.SEP24_WITHDRAW }, "SEP-24 Withdraw")))),
                        !isUntrusted && (supportedActions === null || supportedActions === void 0 ? void 0 : supportedActions.sep31) && (React.createElement("option", { value: AssetActionId.SEP31_SEND }, "SEP-31 Send"))))));
        }
        return null;
    };
    return (React.createElement("div", { className: `BalanceRow Layout__inset ${isActive ? "active" : ""} ${disabled ? "disabled" : ""}`, key: assetString },
        React.createElement("div", { className: "BalanceCell BalanceInfo" }, notExist ? (React.createElement("div", { className: "BalanceAmount error" }, `${assetCode}:${shortenStellarKey(assetIssuer)} does not exist`)) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "BalanceAmount" }, `${total || "0"} ${assetCode}`),
            React.createElement("div", { className: "BalanceOptions Layout__inline" },
                homeDomain && (React.createElement(TextLink, { href: `//${homeDomain}/.well-known/stellar.toml`, variant: TextLink.variant.secondary, underline: true }, homeDomain)),
                !asset.isClaimableBalance &&
                    asset.assetType !== AssetType.NATIVE && (React.createElement(HomeDomainOverrideButtons, { asset: asset })))))),
        (supportedActions === null || supportedActions === void 0 ? void 0 : supportedActions.sep8) && (React.createElement("div", { className: "BalanceCell RegulatedAsset" },
            React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                    "Payments with regulated assets need to be approved by the asset issuer. For more information please refer to ",
                    React.createElement(TextLink, { href: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md" }, "SEP-8"),
                    ".") },
                React.createElement("span", null, "Regulated")))),
        React.createElement("div", { className: "BalanceCell BalanceActions" },
            children && React.createElement("div", { className: "CustomCell" }, children),
            renderActionsSelect())));
};
//# sourceMappingURL=BalanceRow.js.map