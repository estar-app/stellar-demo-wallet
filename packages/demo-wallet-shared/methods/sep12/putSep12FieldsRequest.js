import { Keypair } from "stellar-sdk";
import { log } from "../../helpers/log";
export const putSep12FieldsRequest = async ({ secretKey, fields, memo, token, kycServer, isSender, }) => {
    const publicKey = Keypair.fromSecret(secretKey).publicKey();
    const data = {
        account: publicKey,
        ...(memo ? { memo, memo_type: "hash" } : {}),
        ...fields,
    };
    log.request({ title: "PUT `/customer`", body: data });
    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        body.append(key, value.toString());
    });
    const result = await fetch(`${kycServer}/customer`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body,
    });
    const resultJson = await result.json();
    if (isSender !== undefined) {
        log.response({
            title: `PUT \`/customer\` (${isSender ? "sender" : "receiver"})`,
            body: resultJson,
        });
    }
    else {
        log.response({
            title: `PUT \`/customer\``,
            body: resultJson,
        });
    }
    if (result.status !== 202) {
        throw new Error(`Unexpected status for PUT \`/customer\` request: ${result.status}`);
    }
    return resultJson;
};
//# sourceMappingURL=putSep12FieldsRequest.js.map