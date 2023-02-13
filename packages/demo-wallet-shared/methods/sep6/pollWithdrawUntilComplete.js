import StellarSdk, { Account, Asset, BASE_FEE, Keypair, Operation, TransactionBuilder, } from "stellar-sdk";
import { log } from "../../helpers/log";
import { createMemoFromType } from "../createMemoFromType";
import { TransactionStatus } from "../../types/types";
export const pollWithdrawUntilComplete = async ({ amount, secretKey, transactionId, token, transferServerUrl, networkPassphrase, networkUrl, assetCode, assetIssuer, }) => {
    const keypair = Keypair.fromSecret(secretKey);
    const server = new StellarSdk.Server(networkUrl);
    let currentStatus = TransactionStatus.INCOMPLETE;
    const transactionUrl = new URL(`${transferServerUrl}/transaction?id=${transactionId}`);
    log.instruction({
        title: `Polling for updates \`${transactionUrl.toString()}\``,
    });
    const endStatuses = [TransactionStatus.COMPLETED, TransactionStatus.ERROR];
    let transactionJson = { transaction: {} };
    while (!endStatuses.includes(currentStatus)) {
        const response = await fetch(transactionUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` },
        });
        transactionJson = await response.json();
        if (transactionJson.transaction.status !== currentStatus) {
            currentStatus = transactionJson.transaction.status;
            log.instruction({
                title: `Transaction \`${transactionId}\` is in \`${transactionJson.transaction.status}\` status`,
            });
            switch (currentStatus) {
                case TransactionStatus.PENDING_USER_TRANSFER_START: {
                    log.instruction({
                        title: "The anchor is waiting for the funds for withdrawal",
                    });
                    const memo = createMemoFromType(transactionJson.transaction.withdraw_memo, transactionJson.transaction.withdraw_memo_type);
                    log.request({
                        title: "Fetching account sequence number",
                        body: keypair.publicKey(),
                    });
                    const { sequence } = await server
                        .accounts()
                        .accountId(keypair.publicKey())
                        .call();
                    log.response({
                        title: "Fetching account sequence number",
                        body: sequence,
                    });
                    const account = new Account(keypair.publicKey(), sequence);
                    const txn = new TransactionBuilder(account, {
                        fee: BASE_FEE,
                        networkPassphrase,
                    })
                        .addOperation(Operation.payment({
                        destination: transactionJson.transaction.withdraw_anchor_account,
                        asset: new Asset(assetCode, assetIssuer),
                        amount,
                    }))
                        .addMemo(memo)
                        .setTimeout(0)
                        .build();
                    txn.sign(keypair);
                    log.request({
                        title: "Submitting withdrawal transaction to Stellar",
                        body: txn,
                    });
                    const horizonResponse = await server.submitTransaction(txn);
                    log.response({
                        title: "Submitted withdrawal transaction to Stellar",
                        body: horizonResponse,
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
    return { currentStatus, transaction: transactionJson.transaction };
};
//# sourceMappingURL=pollWithdrawUntilComplete.js.map