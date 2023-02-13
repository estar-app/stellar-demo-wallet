import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, InfoBlock, TextLink, Modal, } from "@stellar/design-system";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { getPresetAssets } from "demo-wallet-shared/build/helpers/getPresetAssets";
import { getValidatedUntrustedAsset } from "demo-wallet-shared/build/helpers/getValidatedUntrustedAsset";
import { log } from "demo-wallet-shared/build/helpers/log";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, SearchParams } from "types/types.d";
import { shortenStellarKey } from "demo-wallet-shared/build/helpers/shortenStellarKey";
export const AddPresetAsset = ({ onClose }) => {
    const { account, allAssets, untrustedAssets } = useRedux("account", "allAssets", "untrustedAssets");
    const [presetAssets, setPresetAssets] = useState([]);
    const [checkedAssets, setCheckedAssets] = useState({});
    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        setPresetAssets(getPresetAssets(allAssets.data));
    }, [allAssets]);
    useEffect(() => {
        if (untrustedAssets.status === ActionStatus.SUCCESS) {
            onClose();
        }
        if (untrustedAssets.errorString) {
            setErrorMessage(untrustedAssets.errorString);
        }
    }, [onClose, untrustedAssets.errorString, untrustedAssets.status]);
    const getAssetId = (asset) => `${asset.assetCode}:${asset.homeDomain || asset.issuerPublicKey}`;
    const hasAnySelectedAsset = () => Object.values(checkedAssets).some((isChecked) => isChecked === true);
    const handleAddUntrustedAssets = async (assetList) => {
        setErrorMessage("");
        setIsValidating(true);
        try {
            const validatedAssetValues = await Promise.all(assetList.map(async (pAsset) => {
                var _a;
                const { assetCode, issuerPublicKey, homeDomain } = pAsset;
                if (!(homeDomain || issuerPublicKey)) {
                    const errorMsg = `Home domain OR issuer public key is required with asset code ${assetCode}`;
                    throw new Error(errorMsg);
                }
                const asset = await getValidatedUntrustedAsset({
                    assetCode,
                    homeDomain,
                    issuerPublicKey,
                    accountBalances: (_a = account.data) === null || _a === void 0 ? void 0 : _a.balances,
                    networkUrl: getNetworkConfig().url,
                });
                return `${asset.assetCode}:${asset.assetIssuer}`;
            }));
            const newSearchQ = searchParam.update(SearchParams.UNTRUSTED_ASSETS, validatedAssetValues.join(","));
            navigate(newSearchQ);
        }
        catch (e) {
            const errorMsg = getErrorMessage(e);
            log.error({ title: errorMsg });
            setErrorMessage(errorMsg);
            setIsValidating(false);
            return;
        }
        setIsValidating(false);
    };
    const isPending = isValidating || untrustedAssets.status === ActionStatus.PENDING;
    const renderAssetRow = (asset) => {
        const { homeDomain, issuerPublicKey: assetIssuer } = asset;
        const assetId = getAssetId(asset);
        const networkUrl = getNetworkConfig().url.replace("https:", "");
        const issuerLink = (homeDomain && `//${homeDomain}/.well-known/stellar.toml`) ||
            (assetIssuer && `${networkUrl}/accounts/${assetIssuer}`);
        const displayLink = homeDomain || (assetIssuer && shortenStellarKey(assetIssuer));
        return (React.createElement("div", { key: `preset-asset-${assetId}`, className: "PresetAssetRow" },
            React.createElement(Checkbox, { id: assetId, label: "", checked: Boolean(checkedAssets[assetId]), onChange: () => {
                    const updatedCheckedAssets = { ...checkedAssets };
                    updatedCheckedAssets[assetId] = !checkedAssets[assetId];
                    setCheckedAssets(updatedCheckedAssets);
                }, disabled: isPending }),
            React.createElement("div", null,
                React.createElement("div", { className: "PresetAssetCode" }, asset.assetCode),
                React.createElement("div", { className: "PresetAssetIssuer" }, displayLink && (React.createElement(TextLink, { href: issuerLink }, displayLink))))));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Add preset asset"),
        React.createElement(Modal.Body, null,
            React.createElement("p", null, "Select one or more assets"),
            React.createElement("div", { className: "PresetAssets" }, presetAssets.map(renderAssetRow)),
            errorMessage && (React.createElement(InfoBlock, { variant: InfoBlock.variant.error },
                React.createElement("p", null, errorMessage)))),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: () => {
                    const assetsToAdd = presetAssets.flatMap((pAsset) => {
                        const assetId = getAssetId(pAsset);
                        return checkedAssets[assetId] ? pAsset : [];
                    });
                    handleAddUntrustedAssets(assetsToAdd);
                }, disabled: !hasAnySelectedAsset(), isLoading: isPending }, "Confirm"))));
};
//# sourceMappingURL=AddPresetAsset.js.map