import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InfoBlock, TextLink, Modal, Input, DetailsTooltip, } from "@stellar/design-system";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { getValidatedUntrustedAsset } from "demo-wallet-shared/build/helpers/getValidatedUntrustedAsset";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { log } from "demo-wallet-shared/build/helpers/log";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, SearchParams } from "types/types.d";
export const AddAsset = ({ onClose }) => {
    const { account, untrustedAssets } = useRedux("account", "untrustedAssets");
    const [isValidating, setIsValidating] = useState(false);
    const [assetCode, setAssetCode] = useState("");
    const [homeDomain, setHomeDomain] = useState("");
    const [issuerPublicKey, setIssuerPublicKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const resetState = () => {
        setAssetCode("");
        setHomeDomain("");
        setIssuerPublicKey("");
        setErrorMessage("");
        setIsValidating(false);
    };
    useEffect(() => () => resetState(), []);
    useEffect(() => {
        if (untrustedAssets.status === ActionStatus.SUCCESS) {
            onClose();
        }
        if (untrustedAssets.errorString) {
            setErrorMessage(untrustedAssets.errorString);
        }
    }, [untrustedAssets.status, untrustedAssets.errorString, onClose]);
    const handleSetUntrustedAsset = async () => {
        var _a;
        setErrorMessage("");
        if (!(homeDomain || issuerPublicKey)) {
            const errorMsg = "Home domain OR issuer public key is required with asset code";
            log.error({ title: errorMsg });
            setErrorMessage(errorMsg);
            return;
        }
        setIsValidating(true);
        try {
            const asset = await getValidatedUntrustedAsset({
                assetCode,
                homeDomain,
                issuerPublicKey,
                accountBalances: (_a = account.data) === null || _a === void 0 ? void 0 : _a.balances,
                networkUrl: getNetworkConfig().url,
            });
            let search = searchParam.update(SearchParams.UNTRUSTED_ASSETS, `${asset.assetCode}:${asset.assetIssuer}`);
            if (asset.homeDomain) {
                search = searchParam.updateKeyPair({
                    param: SearchParams.ASSET_OVERRIDES,
                    itemId: `${asset.assetCode}:${asset.assetIssuer}`,
                    keyPairs: { homeDomain },
                    urlSearchParams: new URLSearchParams(search),
                });
            }
            navigate(search);
            setIsValidating(false);
        }
        catch (e) {
            const errorMsg = getErrorMessage(e);
            log.error({ title: errorMsg });
            setErrorMessage(errorMsg);
            setIsValidating(false);
        }
    };
    const isPending = isValidating || untrustedAssets.status === ActionStatus.PENDING;
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Add asset"),
        React.createElement(Modal.Body, null,
            React.createElement("p", null, "Required: asset code AND (home domain OR issuer)"),
            React.createElement(Input, { id: "aa-asset-code", label: React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                        "Assets are identified by 1) their code and 2) either a home domain or the public key of the issuing account.",
                        " ",
                        React.createElement(TextLink, { href: "https://developers.stellar.org/docs/issuing-assets/publishing-asset-info/" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                    React.createElement(React.Fragment, null, "Asset code")), onChange: (e) => {
                    setErrorMessage("");
                    setAssetCode(e.target.value);
                }, value: assetCode, placeholder: "ex: USDC, EURT, NGNT" }),
            React.createElement(Input, { id: "aa-home-domain", label: React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                        "Domain where the well-known TOML file can be found for this asset.",
                        " ",
                        React.createElement(TextLink, { href: "https://developers.stellar.org/docs/issuing-assets/publishing-asset-info/#what-is-a-stellartoml" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                    React.createElement(React.Fragment, null, "Anchor home domain")), onChange: (e) => {
                    setErrorMessage("");
                    setHomeDomain(e.target.value);
                }, value: homeDomain, placeholder: "ex: example.com" }),
            React.createElement(Input, { id: "aa-public-key", label: React.createElement(DetailsTooltip, { details: React.createElement(React.Fragment, null,
                        "Public key for the Asset Issuer.",
                        " ",
                        React.createElement(TextLink, { href: "https://developers.stellar.org/docs/issuing-assets/how-to-issue-an-asset" }, "Learn more")), isInline: true, tooltipPosition: DetailsTooltip.tooltipPosition.BOTTOM },
                    React.createElement(React.Fragment, null, "Issuer public key")), onChange: (e) => {
                    setErrorMessage("");
                    setIssuerPublicKey(e.target.value);
                }, value: issuerPublicKey, placeholder: "ex: GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B" }),
            errorMessage && (React.createElement(InfoBlock, { variant: InfoBlock.variant.error },
                React.createElement("p", null, errorMessage)))),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSetUntrustedAsset, disabled: !assetCode, isLoading: isPending }, "Add"))));
};
//# sourceMappingURL=AddAsset.js.map