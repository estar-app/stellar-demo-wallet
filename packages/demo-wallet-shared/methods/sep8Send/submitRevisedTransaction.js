import StellarSdk, { Keypair, TransactionBuilder, } from "stellar-sdk";
import { getErrorString } from "../../helpers/getErrorString";
import { getNetworkConfig } from "../../helpers/getNetworkConfig";
import { log } from "../../helpers/log";
export const submitRevisedTransaction = async ({ amount, assetCode, destination, revisedTxXdr, secretKey, }) => {
    const networkConfig = getNetworkConfig();
    const server = new StellarSdk.Server(networkConfig.url);
    const transaction = TransactionBuilder.fromXDR(revisedTxXdr, networkConfig.network);
    try {
        const keypair = Keypair.fromSecret(secretKey);
        transaction.sign(keypair);
    }
    catch (error) {
        throw new Error(`Failed to sign transaction, error: ${getErrorString(error)}`);
    }
    log.request({
        title: "Submitting send payment transaction",
        body: transaction,
    });
    const result = await server.submitTransaction(transaction);
    log.response({ title: "Submitted send payment transaction", body: result });
    log.instruction({
        title: "SEP-8 send payment completed 🎉",
        body: `Payment of ${amount} ${assetCode} successfully sent to ${destination}.`,
    });
    return result;
};
//# sourceMappingURL=submitRevisedTransaction.js.map