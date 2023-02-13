import { PRESET_ASSETS } from "../constants/presetAssets";
export const getPresetAssets = (allAssets) => {
    const newPresetAssets = PRESET_ASSETS.filter((pAsset) => !allAssets.some((a) => a.assetCode === pAsset.assetCode &&
        (a.homeDomain === pAsset.homeDomain ||
            a.assetIssuer === pAsset.issuerPublicKey)));
    return newPresetAssets;
};
//# sourceMappingURL=getPresetAssets.js.map