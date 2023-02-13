import { AssetType, } from "../types/types";
export const normalizeAssetProps = ({ source, homeDomain, supportedActions, isUntrusted = false, assetCode = "", assetIssuer = "", assetType = "", }) => {
    var _a;
    const _assetCode = assetCode || (source === null || source === void 0 ? void 0 : source.token.code);
    const _assetType = assetType || (source === null || source === void 0 ? void 0 : source.token.type);
    if (!(_assetCode && _assetType)) {
        throw new Error("Asset code and asset type are required");
    }
    let _assetIssuer = assetIssuer;
    if (!_assetIssuer && _assetType !== AssetType.NATIVE) {
        _assetIssuer = source.token.issuer.key;
    }
    return {
        assetString: _assetType === AssetType.NATIVE
            ? "native"
            : `${_assetCode}:${_assetIssuer}`,
        assetCode: _assetCode,
        assetIssuer: _assetIssuer,
        assetType: _assetType,
        total: ((_a = source === null || source === void 0 ? void 0 : source.available) === null || _a === void 0 ? void 0 : _a.toString()) || "0",
        homeDomain,
        supportedActions,
        isUntrusted,
        source,
    };
};
//# sourceMappingURL=normalizeAssetProps.js.map