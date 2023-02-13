import StellarSdk from "stellar-sdk";
import { getErrorString } from "../../helpers/getErrorString";
import { getNetworkConfig } from "../../helpers/getNetworkConfig";
import { log } from "../../helpers/log";
import { Sep9FieldsDict } from "../../helpers/Sep9Fields";
import { buildPaymentTransaction } from "../submitPaymentTransaction";
import { Sep8ApprovalStatus, } from "../../types/types";
export const revisePaymentTransaction = async ({ params, }) => {
    var _a, _b;
    const server = new StellarSdk.Server(getNetworkConfig().url);
    const { approvalServer } = params;
    let transaction;
    try {
        transaction = await buildPaymentTransaction({
            params,
            server,
        });
    }
    catch (error) {
        throw new Error(`Failed to build transaction, error: ${getErrorString(error)}`);
    }
    log.request({
        title: `Authorizing SEP-8 payment of ${params.amount} ${params.assetCode}`,
        body: `Destination: ${params.destination}`,
    });
    const submittedTxXdr = transaction.toEnvelope().toXDR("base64");
    const sep8ApprovalResult = await fetch(approvalServer, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tx: submittedTxXdr,
        }),
    });
    const sep8ApprovalResultJson = await sep8ApprovalResult.json();
    switch (sep8ApprovalResultJson.status) {
        case Sep8ApprovalStatus.ACTION_REQUIRED: {
            log.response({
                title: "Action Required",
                body: "Additional information is needed before we can proceed.",
            });
            log.instruction({
                title: sep8ApprovalResultJson.message,
            });
            const actionFields = (_a = sep8ApprovalResultJson.action_fields) === null || _a === void 0 ? void 0 : _a.map((fieldName) => Sep9FieldsDict[fieldName]);
            return {
                status: Sep8ApprovalStatus.ACTION_REQUIRED,
                actionRequiredInfo: {
                    actionFields,
                    actionMethod: (_b = sep8ApprovalResultJson.action_method) !== null && _b !== void 0 ? _b : "GET",
                    actionUrl: sep8ApprovalResultJson.action_url,
                    message: sep8ApprovalResultJson.message,
                },
                revisedTransaction: {
                    amount: params.amount,
                    destination: params.destination,
                    submittedTxXdr,
                    revisedTxXdr: "",
                },
            };
        }
        case Sep8ApprovalStatus.PENDING: {
            let pendingApprovalBody = "The issuer could not determine whether to approve the transaction at this time.";
            const { timeout } = sep8ApprovalResultJson;
            if (timeout) {
                const dateStr = new Date(timeout).toLocaleString();
                pendingApprovalBody += ` You can re-submit the same transaction on ${dateStr}.`;
            }
            log.response({
                title: "Authorization Pending",
                body: pendingApprovalBody,
            });
            if (sep8ApprovalResultJson.message) {
                log.instruction({ title: sep8ApprovalResultJson.message });
            }
            return { status: sep8ApprovalResultJson.status };
        }
        case Sep8ApprovalStatus.REJECTED:
            throw new Error(sep8ApprovalResultJson.error);
        case Sep8ApprovalStatus.REVISED:
        case Sep8ApprovalStatus.SUCCESS:
            log.response({
                title: `Payment transaction revised and authorized 🎉.`,
                body: sep8ApprovalResultJson.message,
            });
            return {
                status: sep8ApprovalResultJson.status,
                revisedTransaction: {
                    amount: params.amount,
                    destination: params.destination,
                    submittedTxXdr,
                    revisedTxXdr: sep8ApprovalResultJson.tx,
                },
            };
        default:
            throw new Error(`The SEP-8 flow for "${sep8ApprovalResultJson.status}" status is not supported yet.`);
    }
};
//# sourceMappingURL=revisePaymentTransaction.js.map