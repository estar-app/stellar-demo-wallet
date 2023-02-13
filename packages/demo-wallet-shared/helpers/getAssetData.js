import { getAssetSettingsFromToml } from "./getAssetSettingsFromToml";
import { normalizeAssetProps } from "./normalizeAssetProps";
export const getAssetData = async ({ balances, networkUrl, }) => {
    const allAssets = Object.entries(balances);
    const assets = [];
    if (!(allAssets === null || allAssets === void 0 ? void 0 : allAssets.length)) {
        return assets;
    }
    for (let i = 0; i < allAssets.length; i++) {
        const [assetId, data] = allAssets[i];
        const { homeDomain, supportedActions } = await getAssetSettingsFromToml({
            assetId,
            networkUrl,
        });
        assets.push(normalizeAssetProps({
            source: data,
            homeDomain,
            supportedActions,
        }));
    }
    return assets;
};
//# sourceMappingURL=getAssetData.js.map