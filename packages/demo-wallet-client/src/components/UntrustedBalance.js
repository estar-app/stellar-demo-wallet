import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextLink, DetailsTooltip } from "@stellar/design-system";
import { BalanceRow } from "components/BalanceRow";
import { resetActiveAssetAction } from "ducks/activeAsset";
import { initiateDepositAction as initiateSep6SendAction } from "ducks/sep6DepositAsset";
import { depositAssetAction } from "ducks/sep24DepositAsset";
import { trustAssetAction } from "ducks/trustAsset";
import { addUntrustedAssetAction, removeUntrustedAssetAction, resetUntrustedAssetStatusAction, } from "ducks/untrustedAssets";
import { log } from "demo-wallet-shared/build/helpers/log";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AssetActionId, SearchParams, AssetCategory, } from "types/types.d";
export const UntrustedBalance = ({ onAssetAction, }) => {
    const { account, activeAsset, allAssets, settings, trustAsset } = useRedux("account", "activeAsset", "allAssets", "settings", "trustAsset");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allUntrustedAssets = allAssets.data.filter((a) => a.category === AssetCategory.UNTRUSTED);
    useEffect(() => {
        if (!settings.untrustedAssets) {
            return;
        }
        dispatch(addUntrustedAssetAction(settings.untrustedAssets));
    }, [settings.untrustedAssets, dispatch]);
    const handleTrustAsset = (asset) => {
        const { assetString, assetCode, assetIssuer } = asset;
        dispatch(trustAssetAction({ assetString, assetCode, assetIssuer }));
    };
    const handleSep6Deposit = (asset) => {
        dispatch(initiateSep6SendAction(asset));
    };
    const handleDepositAsset = (asset) => {
        dispatch(depositAssetAction(asset));
    };
    const handleRemoveAsset = (asset) => {
        const { assetString } = asset;
        navigate(searchParam.remove(SearchParams.UNTRUSTED_ASSETS, assetString));
        dispatch(removeUntrustedAssetAction(assetString));
        log.instruction({ title: `Untrusted asset \`${assetString}\` removed` });
        dispatch(resetUntrustedAssetStatusAction());
        dispatch(resetActiveAssetAction());
    };
    const handleAction = ({ actionId, asset, }) => {
        if (!actionId) {
            return;
        }
        let props;
        const defaultProps = {
            assetString: asset.assetString,
            balance: asset,
        };
        const TRUSTED_ASSET_EXPLANATION = "A lumen is the only asset type that can be used on the Stellar network that doesn’t require an issuer or a trustline.";
        switch (actionId) {
            case AssetActionId.SEP6_DEPOSIT:
                props = {
                    ...defaultProps,
                    title: `SEP-6 deposit ${asset.assetCode} (with untrusted Asset)`,
                    description: `Start SEP-6 deposit of untrusted asset ${asset.assetCode}? ${TRUSTED_ASSET_EXPLANATION}`,
                    callback: () => handleSep6Deposit(asset),
                };
                break;
            case AssetActionId.SEP24_DEPOSIT:
                props = {
                    ...defaultProps,
                    title: `SEP-24 deposit ${asset.assetCode} (with untrusted Asset)`,
                    description: `Start SEP-24 deposit of untrusted asset ${asset.assetCode}? ${TRUSTED_ASSET_EXPLANATION}`,
                    callback: () => handleDepositAsset(asset),
                    showCustodial: true,
                };
                break;
            case AssetActionId.TRUST_ASSET:
                props = {
                    ...defaultProps,
                    title: `Add Trustline “Trust Asset ${asset.assetCode}”?`,
                    description: (React.createElement("p", null,
                        "You are about to create a trustline to asset",
                        " ",
                        React.createElement("code", null, `${asset.assetCode}:${asset.assetIssuer}`),
                        ". This will allow you to hold this asset.",
                        " ",
                        React.createElement(TextLink, { href: "https://developers.stellar.org/docs/issuing-assets/anatomy-of-an-asset/#trustlines" }, "Learn more"))),
                    callback: () => handleTrustAsset(asset),
                };
                break;
            case AssetActionId.REMOVE_ASSET:
                props = {
                    ...defaultProps,
                    title: `Remove asset ${asset.assetCode}`,
                    description: (React.createElement("p", null,
                        "Asset ",
                        React.createElement("code", null, `${asset.assetCode}:${asset.assetIssuer}`),
                        " ",
                        "does not exist, remove it?")),
                    callback: () => handleRemoveAsset(asset),
                };
                break;
            default:
        }
        if (!props) {
            return;
        }
        onAssetAction(props);
    };
    const disabledButton = Boolean(activeAsset.action) || trustAsset.status === ActionStatus.PENDING;
    return (React.createElement(React.Fragment, null, allUntrustedAssets.map((asset) => asset.isUntrusted ? (React.createElement(BalanceRow, { activeAction: activeAsset.action, key: asset.assetString, asset: asset, onAction: (actionId, assetItem) => handleAction({ actionId, asset: assetItem }) },
        React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                "Adding a trustline means you trust an issuer to redeem its credit. If you\u2019re testing SEP-24 or SEP-6 you may not want to do this.",
                " ",
                React.createElement(TextLink, { href: "https://developers.stellar.org/docs/issuing-assets/anatomy-of-an-asset/#trustlines" }, "Learn more")) },
            React.createElement(TextLink, { onClick: () => handleAction({
                    actionId: AssetActionId.TRUST_ASSET,
                    asset,
                }), disabled: account.isUnfunded || disabledButton }, "Add trustline")))) : (React.createElement(BalanceRow, { activeAction: activeAsset.action, key: asset.assetString, asset: asset },
        React.createElement(TextLink, { onClick: () => handleAction({
                actionId: AssetActionId.REMOVE_ASSET,
                asset,
            }), disabled: disabledButton }, "Remove"))))));
};
//# sourceMappingURL=UntrustedBalance.js.map