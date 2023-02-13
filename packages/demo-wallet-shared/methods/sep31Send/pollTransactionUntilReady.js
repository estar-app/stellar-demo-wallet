import { log } from "../../helpers/log";
import { TransactionStatus } from "../../types/types";
export const pollTransactionUntilReady = async ({ sendServer, transactionId, token, }) => {
    var _a;
    log.instruction({
        title: `Polling \`/transactions/:id\` endpoint until transaction status is \`${TransactionStatus.PENDING_SENDER}\``,
    });
    let transactionStatus;
    let resultJson = {};
    while (transactionStatus !== TransactionStatus.PENDING_SENDER) {
        log.request({ title: `GET \`/transactions/${transactionId}\`` });
        const result = await fetch(`${sendServer}/transactions/${transactionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (result.status !== 200) {
            throw new Error(`GET \`/transactions/${transactionId}\` responded with status \`${result.status}\``);
        }
        resultJson = await result.json();
        log.response({
            title: `GET \`/transactions/${transactionId}\``,
            body: resultJson,
        });
        transactionStatus = (_a = resultJson.transaction) === null || _a === void 0 ? void 0 : _a.status;
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    return resultJson;
};
//# sourceMappingURL=pollTransactionUntilReady.js.map