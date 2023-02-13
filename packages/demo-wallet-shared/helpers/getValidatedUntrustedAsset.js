import { checkAssetExists } from "./checkAssetExists";
import { getErrorMessage } from "./getErrorMessage";
import { getAssetFromHomeDomain } from "./getAssetFromHomeDomain";
import { log } from "./log";
export const getValidatedUntrustedAsset = async ({ assetCode, homeDomain, issuerPublicKey, accountBalances, networkUrl, }) => {
    log.instruction({
        title: `Validating untrusted asset ${assetCode}`,
    });
    if (assetCode && !(homeDomain || issuerPublicKey)) {
        throw new Error("Home domain OR issuer public key is required with asset code");
    }
    if (issuerPublicKey && !homeDomain) {
        await checkAssetExists({
            assetCode,
            assetIssuer: issuerPublicKey,
            networkUrl,
            accountBalances,
        });
        return {
            assetCode,
            assetIssuer: issuerPublicKey,
        };
    }
    if (homeDomain) {
        try {
            return await getAssetFromHomeDomain({
                assetCode,
                homeDomain,
                issuerPublicKey,
                networkUrl,
                accountBalances,
            });
        }
        catch (e) {
            throw new Error(getErrorMessage(e));
        }
    }
    const errorMessage = "No asset was found matching provided information";
    log.error({
        title: errorMessage,
        body: {
            assetCode,
            homeDomain,
            issuerPublicKey,
        },
    });
    throw new Error(errorMessage);
};
//# sourceMappingURL=getValidatedUntrustedAsset.js.map