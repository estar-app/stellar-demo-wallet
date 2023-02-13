import { Server } from "stellar-sdk";
import { getAssetSettingsFromToml } from "./getAssetSettingsFromToml";
import { normalizeAssetProps } from "./normalizeAssetProps";
import { log } from "./log";
export const getUntrustedAssetData = async ({ assetsToAdd, accountAssets, networkUrl, }) => {
    if (!assetsToAdd.length) {
        log.instruction({ title: `No assets to fetch` });
    }
    let response = [];
    for (let i = 0; i < assetsToAdd.length; i++) {
        const assetString = assetsToAdd[i];
        const [assetCode, assetIssuer] = assetString.split(":");
        if (accountAssets === null || accountAssets === void 0 ? void 0 : accountAssets[assetString]) {
            log.instruction({ title: `Asset \`${assetString}\` is already trusted` });
            continue;
        }
        log.request({ title: `Fetching asset \`${assetString}\` record` });
        const server = new Server(networkUrl);
        const assetResponse = await server
            .assets()
            .forCode(assetCode)
            .forIssuer(assetIssuer)
            .call();
        if (!assetResponse.records.length) {
            log.error({
                title: `Asset \`${assetString}\` does not exist`,
            });
            response = [
                ...response,
                {
                    assetString,
                    assetCode,
                    assetIssuer,
                    assetType: "none",
                    total: "0",
                    notExist: true,
                    source: {},
                },
            ];
        }
        else {
            log.response({
                title: `Asset \`${assetString}\` record fetched`,
                body: assetResponse.records[0],
            });
            const { homeDomain, supportedActions } = await getAssetSettingsFromToml({
                assetId: assetString,
                networkUrl,
            });
            const data = normalizeAssetProps({
                assetCode,
                assetIssuer,
                assetType: assetResponse.records[0].asset_type,
                homeDomain,
                supportedActions,
                isUntrusted: true,
            });
            response = [...response, data];
            log.instruction({
                title: `Asset \`${assetString}\` added`,
            });
        }
    }
    return response;
};
//# sourceMappingURL=getUntrustedAssetData.js.map