import { Server } from "stellar-sdk";
import { getToml } from "../methods/getToml";
import { AssetType } from "../types/types";
export const getAssetSettingsFromToml = async ({ assetId, networkUrl, homeDomainOverride, }) => {
    const server = new Server(networkUrl);
    if (assetId === AssetType.NATIVE) {
        return {
            homeDomain: undefined,
            supportedActions: {},
        };
    }
    let supportedActions = {};
    const [, assetIssuer] = assetId.split(":");
    let homeDomain = homeDomainOverride;
    if (!homeDomainOverride) {
        const accountRecord = await server.loadAccount(assetIssuer);
        homeDomain = accountRecord.home_domain;
    }
    if (homeDomain) {
        const toml = await getToml(homeDomain);
        const { CURRENCIES, TRANSFER_SERVER, TRANSFER_SERVER_SEP0024, DIRECT_PAYMENT_SERVER, } = toml;
        supportedActions = {
            sep6: Boolean(TRANSFER_SERVER),
            sep8: isSep8Asset({ assetId, currencies: CURRENCIES }),
            sep24: Boolean(TRANSFER_SERVER_SEP0024),
            sep31: Boolean(DIRECT_PAYMENT_SERVER),
        };
    }
    return {
        homeDomain,
        ...{ supportedActions },
    };
};
const isSep8Asset = ({ currencies, assetId, }) => {
    const [assetCode, assetIssuer] = assetId.split(":");
    const currency = currencies.find((c) => c.code === assetCode && c.issuer === assetIssuer);
    return Boolean(currency === null || currency === void 0 ? void 0 : currency.regulated);
};
//# sourceMappingURL=getAssetSettingsFromToml.js.map