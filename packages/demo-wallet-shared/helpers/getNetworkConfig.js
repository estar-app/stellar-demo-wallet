import StellarSdk from "stellar-sdk";
export const getNetworkConfig = () => {
    var _a, _b;
    return ({
        network: ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.REACT_APP_HORIZON_PASSPHRASE) || StellarSdk.Networks.TESTNET,
        url: ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.REACT_APP_HORIZON_URL) ||
            "https://horizon-testnet.stellar.org",
    });
};
//# sourceMappingURL=getNetworkConfig.js.map