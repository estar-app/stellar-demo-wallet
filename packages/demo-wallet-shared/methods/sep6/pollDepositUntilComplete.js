import { getErrorMessage } from "../../helpers/getErrorMessage";
import { log } from "../../helpers/log";
import { TransactionStatus } from "../../types/types";
export const pollDepositUntilComplete = async ({ transactionId, token, transferServerUrl, trustAssetCallback, }) => {
    let currentStatus = TransactionStatus.INCOMPLETE;
    let trustedAssetAdded;
    const transactionUrl = new URL(`${transferServerUrl}/transaction?id=${transactionId}`);
    log.instruction({
        title: `Polling for updates \`${transactionUrl.toString()}\``,
    });
    const endStatuses = [
        TransactionStatus.PENDING_EXTERNAL,
        TransactionStatus.COMPLETED,
        TransactionStatus.ERROR,
    ];
    while (!endStatuses.includes(currentStatus)) {
        const response = await fetch(transactionUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` },
        });
        const transactionJson = await response.json();
        if (transactionJson.transaction.status !== currentStatus) {
            currentStatus = transactionJson.transaction.status;
            log.instruction({
                title: `Transaction \`${transactionId}\` is in \`${transactionJson.transaction.status}\` status`,
            });
            switch (currentStatus) {
                case TransactionStatus.PENDING_USER_TRANSFER_START: {
                    log.instruction({
                        title: "The anchor is waiting on you to take the action described in the popup",
                    });
                    break;
                }
                case TransactionStatus.PENDING_ANCHOR: {
                    log.instruction({
                        title: "The anchor is processing the transaction",
                    });
                    break;
                }
                case TransactionStatus.PENDING_STELLAR: {
                    log.instruction({
                        title: "The Stellar network is processing the transaction",
                    });
                    break;
                }
                case TransactionStatus.PENDING_EXTERNAL: {
                    log.instruction({
                        title: "The transaction is being processed by an external system",
                    });
                    break;
                }
                case TransactionStatus.PENDING_TRUST: {
                    log.instruction({
                        title: "You must add a trustline to the asset in order to receive your deposit",
                    });
                    try {
                        trustedAssetAdded = await trustAssetCallback();
                    }
                    catch (error) {
                        throw new Error(getErrorMessage(error));
                    }
                    break;
                }
                case TransactionStatus.PENDING_USER: {
                    log.instruction({
                        title: "The anchor is waiting for you to take the action described in the popup",
                    });
                    break;
                }
                case TransactionStatus.ERROR: {
                    log.instruction({
                        title: "There was a problem processing your transaction",
                    });
                    break;
                }
                default:
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    log.instruction({ title: `Transaction status \`${currentStatus}\`` });
    return { currentStatus, trustedAssetAdded };
};
//# sourceMappingURL=pollDepositUntilComplete.js.map