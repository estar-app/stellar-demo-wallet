import { Server } from "stellar-sdk";
import { getAssetSettingsFromToml } from "./getAssetSettingsFromToml";
import { log } from "./log";
import { normalizeAssetProps } from "./normalizeAssetProps";
export const getAssetOverridesData = async ({ assetOverrides, networkUrl, }) => {
    if (!assetOverrides.length) {
        return [];
    }
    let response = [];
    for (let i = 0; i < assetOverrides.length; i++) {
        const { assetString, homeDomain } = assetOverrides[i];
        const [assetCode, assetIssuer] = assetString.split(":");
        const server = new Server(networkUrl);
        const assetResponse = await server
            .assets()
            .forCode(assetCode)
            .forIssuer(assetIssuer)
            .call();
        if (!assetResponse.records.length) {
            log.error({
                title: `Asset \`${assetString}\` does not exist.`,
            });
            break;
        }
        const { supportedActions } = await getAssetSettingsFromToml({
            assetId: assetString,
            networkUrl,
            homeDomainOverride: homeDomain,
        });
        const data = normalizeAssetProps({
            assetCode,
            assetIssuer,
            assetType: assetResponse.records[0].asset_type,
            homeDomain,
            supportedActions,
        });
        response = [...response, data];
    }
    return response;
};
//# sourceMappingURL=getAssetOverridesData.js.map