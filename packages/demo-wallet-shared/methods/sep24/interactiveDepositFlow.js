import { each } from "lodash";
import { log } from "../../helpers/log";
export const interactiveDepositFlow = async ({ assetCode, publicKey, sep24TransferServerUrl, token, claimableBalanceSupported, memo, memoType, }) => {
    log.instruction({ title: "Starting SEP-24 interactive flow for deposit" });
    const formData = new FormData();
    const postDepositParams = {
        asset_code: assetCode,
        account: publicKey,
        lang: "en",
        claimable_balance_supported: claimableBalanceSupported.toString(),
        ...(memo && memoType ? { memo, memo_type: memoType } : {}),
    };
    each(postDepositParams, (value, key) => formData.append(key, value));
    log.request({
        title: `POST \`${sep24TransferServerUrl}/transactions/deposit/interactive\``,
        body: postDepositParams,
    });
    const response = await fetch(`${sep24TransferServerUrl}/transactions/deposit/interactive`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const interactiveJson = await response.json();
    log.response({
        title: `POST \`${sep24TransferServerUrl}/transactions/deposit/interactive\``,
        body: interactiveJson,
    });
    if (!interactiveJson.url) {
        throw new Error("No URL returned from POST `/transactions/deposit/interactive`");
    }
    return interactiveJson;
};
//# sourceMappingURL=interactiveDepositFlow.js.map