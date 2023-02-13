import { each } from "lodash";
import { log } from "../../helpers/log";
export const programmaticWithdrawFlow = async ({ assetCode, publicKey, transferServerUrl, token, type, withdrawFields, claimableBalanceSupported, }) => {
    log.instruction({ title: "Starting SEP-6 programmatic flow for withdrawal" });
    const API_METHOD = "GET";
    const REQUEST_URL_STR = `${transferServerUrl}/withdraw`;
    const REQUEST_URL = new URL(REQUEST_URL_STR);
    const getWithdrawParams = {
        asset_code: assetCode,
        account: publicKey,
        claimable_balance_supported: claimableBalanceSupported.toString(),
        type,
        ...withdrawFields,
    };
    each(getWithdrawParams, (value, key) => REQUEST_URL.searchParams.append(key, value));
    log.request({
        title: `${API_METHOD} \`${REQUEST_URL_STR}\``,
        body: getWithdrawParams,
    });
    const response = await fetch(`${REQUEST_URL}`, {
        method: API_METHOD,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const withdrawJson = await response.json();
    if (response.status !== 200) {
        throw new Error(withdrawJson.error);
    }
    log.response({
        title: `${API_METHOD} \`${REQUEST_URL_STR}\``,
        body: withdrawJson,
    });
    return withdrawJson;
};
//# sourceMappingURL=programmaticWithdrawFlow.js.map