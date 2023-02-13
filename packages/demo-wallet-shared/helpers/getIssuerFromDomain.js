import { getCurrenciesFromDomain } from "./getCurrenciesFromDomain";
export const getIssuerFromDomain = async ({ assetCode, homeDomain, }) => {
    const currencies = await getCurrenciesFromDomain(homeDomain);
    const matchingCurrency = currencies.find((c) => c.code === assetCode);
    if (!(matchingCurrency === null || matchingCurrency === void 0 ? void 0 : matchingCurrency.issuer)) {
        const availableAssets = currencies.map((c) => c.code).join(", ");
        throw new Error(`Unable to find the ${assetCode} issuer on the home domain’s TOML file.
      Available asset${currencies.length > 1 ? "s" : ""}: ${availableAssets}.`);
    }
    return matchingCurrency.issuer;
};
//# sourceMappingURL=getIssuerFromDomain.js.map