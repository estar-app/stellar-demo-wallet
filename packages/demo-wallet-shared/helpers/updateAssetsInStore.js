export const updateAssetsInStore = (currentAssets, assetsToUpdate) => currentAssets.reduce((result, asset) => {
    const foundAsset = assetsToUpdate.find((a) => a.assetString === asset.assetString);
    if (foundAsset) {
        return [...result, { ...asset, ...foundAsset }];
    }
    return [...result, asset];
}, []);
//# sourceMappingURL=updateAssetsInStore.js.map