import { log } from "../../helpers/log";
import { Sep12CustomerStatus, Sep12CustomerFieldStatus, } from "../../types/types";
export const collectSep12Fields = async ({ kycServer, memo, publicKey, token, type, isNewCustomer, }) => {
    var _a;
    const params = {
        ...(type ? { type } : {}),
        account: publicKey,
        ...(memo ? { memo, memo_type: "hash" } : {}),
    };
    log.request({ title: "GET `/customer`", body: params });
    const urlParams = new URLSearchParams(params);
    const result = await fetch(`${kycServer}/customer?${urlParams.toString()}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Origin: "https://demo-wallet.stellar.org",
        },
    });
    const resultJson = await result.json();
    log.response({ title: "GET `/customer`", body: resultJson });
    if (isNewCustomer && resultJson.status !== Sep12CustomerStatus.NEEDS_INFO) {
        throw new Error(`Unexpected status for new customer \`${resultJson.status}\``);
    }
    const fieldsToCollect = Object.entries((_a = resultJson.fields) !== null && _a !== void 0 ? _a : {}).reduce((collectResult, field) => {
        const [key, props] = field;
        if (!props.status ||
            props.status === Sep12CustomerFieldStatus.NOT_PROVIDED ||
            (props.status === Sep12CustomerFieldStatus.REJECTED &&
                resultJson.status === Sep12CustomerStatus.NEEDS_INFO)) {
            return { ...collectResult, [key]: props };
        }
        return collectResult;
    }, {});
    if (resultJson.fields) {
        log.instruction({
            title: "Received the following customer fields",
            body: resultJson.fields,
        });
    }
    if (Object.keys(fieldsToCollect).length) {
        log.instruction({
            title: "The following customer fields must be submitted",
            body: fieldsToCollect,
        });
    }
    else {
        log.instruction({
            title: "No customer fields need to be submitted",
        });
    }
    return fieldsToCollect;
};
//# sourceMappingURL=collectSep12Fields.js.map