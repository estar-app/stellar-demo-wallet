import { checkAssetExists } from "./checkAssetExists";
import { getCurrenciesFromDomain } from "./getCurrenciesFromDomain";
import { getOverrideHomeDomain } from "./getOverrideHomeDomain";
const getAssetListString = (assetsArray, key) => assetsArray && assetsArray.length
    ? assetsArray.map((a) => a[key]).join(", ")
    : "";
export const getAssetFromHomeDomain = async ({ assetCode, homeDomain, issuerPublicKey, networkUrl, accountBalances, }) => {
    const tomlCurrencies = await getCurrenciesFromDomain(homeDomain);
    const matchingAssets = tomlCurrencies.filter((currency) => currency.code === assetCode);
    const availableAssetsString = getAssetListString(tomlCurrencies, "code");
    const availableIssuersString = getAssetListString(matchingAssets, "issuer");
    if (!matchingAssets.length) {
        throw new Error(`Unable to find the ${assetCode} asset on \`${homeDomain}\` TOML file.
      Available assets: ${availableAssetsString}.`);
    }
    if (issuerPublicKey) {
        const matchingIssuer = matchingAssets.find((m) => m.issuer === issuerPublicKey);
        if (matchingIssuer) {
            await checkAssetExists({
                assetCode,
                assetIssuer: issuerPublicKey,
                networkUrl,
                accountBalances,
            });
            return {
                assetCode,
                assetIssuer: issuerPublicKey,
                homeDomain: await getOverrideHomeDomain({
                    assetIssuer: issuerPublicKey,
                    homeDomain,
                    networkUrl,
                }),
            };
        }
        throw new Error(`Unable to find the ${assetCode} asset from issuer \`${issuerPublicKey}\` on \`${homeDomain}\` TOML file.
      Available issuers for ${assetCode}: ${availableIssuersString}.`);
    }
    else {
        if (matchingAssets.length === 1) {
            const { issuer } = matchingAssets[0];
            await checkAssetExists({
                assetCode,
                assetIssuer: issuer,
                networkUrl,
                accountBalances,
            });
            return {
                assetCode,
                assetIssuer: issuer,
                homeDomain: await getOverrideHomeDomain({
                    assetIssuer: issuer,
                    homeDomain,
                    networkUrl,
                }),
            };
        }
        throw new Error(`Multiple issuers found for asset ${assetCode}, please provide issuer public key.
          Available issuers for ${assetCode}: ${availableIssuersString}.`);
    }
};
//# sourceMappingURL=getAssetFromHomeDomain.js.map