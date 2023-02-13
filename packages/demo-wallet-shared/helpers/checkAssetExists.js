import { Server } from "stellar-sdk";
export const checkAssetExists = async ({ assetCode, assetIssuer, networkUrl, accountBalances, }) => {
    const asset = `${assetCode}:${assetIssuer}`;
    if (accountBalances && (accountBalances === null || accountBalances === void 0 ? void 0 : accountBalances[asset])) {
        throw new Error(`Asset \`${asset}\` is already trusted`);
    }
    const server = new Server(networkUrl);
    const assetResponse = await server
        .assets()
        .forCode(assetCode)
        .forIssuer(assetIssuer)
        .call();
    if (!assetResponse.records.length) {
        throw new Error(`Asset \`${asset}\` does not exist`);
    }
};
//# sourceMappingURL=checkAssetExists.js.map