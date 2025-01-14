export const TX_ERROR_TEXT = {
    buy_not_authorized: "The issuer must authorize you to trade this token. Visit the issuer’s site more info.",
    op_malformed: "The input is incorrect and would result in an invalid offer.",
    op_sell_no_trust: "You are not authorized to sell this asset.",
    op_line_full: "You have reached the limit allowed for buying that asset.",
    op_no_destination: "The destination account doesn't exist.",
    op_no_trust: "One or more accounts in this transaction doesn't have a trustline with the desired asset.",
    op_underfunded: "You don’t have enough to cover that transaction.",
    op_under_dest_min: "We couldn’t complete your transaction at this time because the exchange rate offered is no longer available. Please try again.",
    op_over_source_max: "We couldn’t complete your transaction at this time because the exchange rate offered is no longer available. Please try again.",
    op_cross_self: "You already have an offer out that would immediately cross this one.",
    op_sell_no_issuer: "The issuer of that token doesn’t exist.",
    buy_no_issuer: "The issuer of that token doesn’t exist.",
    op_offer_not_found: "We couldn’t find that offer.",
    op_low_reserve: "That offer would take you below the minimum XLM reserve.",
    op_not_authorized: "This operation was not authorized, please make sure the asset you used complies with the Regulated Assets protocol (SEP-8).",
    tx_bad_auth: "Something went wrong while signing a transaction.",
    tx_bad_seq: "The app has gotten out of sync with the network. Please try again later.",
    tx_too_late: "This transaction has expired.",
};
export function getErrorString(err) {
    const e = err && err.response ? err.response : err;
    if (e && e.status === 504) {
        return "Sorry, the request timed out! Please try again later.";
    }
    if (e && e.data && e.data.extras && e.data.extras.result_codes) {
        const resultCodes = e.data.extras.result_codes;
        if (resultCodes.operations) {
            const codes = resultCodes.operations;
            const ignoredCodes = ["op_success"];
            const message = codes
                .filter((code) => !ignoredCodes.includes(code))
                .map((code) => TX_ERROR_TEXT[code] || `Error code '${code}'.`)
                .join(" ");
            if (message) {
                return message;
            }
        }
        if (resultCodes.transaction) {
            return (TX_ERROR_TEXT[resultCodes.transaction] ||
                `Error code '${resultCodes.transaction}'`);
        }
    }
    if (e && e.data && e.data.detail) {
        return e.data.detail;
    }
    if (e && e.detail) {
        return e.detail;
    }
    if (e && e.message) {
        return e.message;
    }
    if (e && e.errors) {
        return e.errors[0].message;
    }
    if (e && e.error) {
        return e.error;
    }
    return e.toString();
}
export function getErrorCodeString(err) {
    const errors = getErrorCodes(err);
    return errors.map((e) => `[Error code: '${e}']`).join(`, `);
}
export function getErrorCodes(err) {
    var _a, _b, _c;
    const e = err && err.response ? err.response : err;
    let errors = [];
    if (e && e.status === 504) {
        return ["request_timeout"];
    }
    if ((_b = (_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.extras) === null || _b === void 0 ? void 0 : _b.result_codes) {
        const { result_codes: resultCodes } = e.data.extras;
        if (resultCodes.operations) {
            const codes = resultCodes.operations;
            const ignoredCodes = ["op_success"];
            errors = [
                ...errors,
                ...codes.filter((code) => !ignoredCodes.includes(code)),
            ];
        }
        if (errors.length) {
            return errors;
        }
        if (resultCodes.transaction) {
            return [resultCodes.transaction];
        }
    }
    if ((_c = e === null || e === void 0 ? void 0 : e.data) === null || _c === void 0 ? void 0 : _c.detail) {
        return [e.data.detail];
    }
    if (e === null || e === void 0 ? void 0 : e.detail) {
        return [e.detail];
    }
    if (e === null || e === void 0 ? void 0 : e.message) {
        return [e.message];
    }
    if (e === null || e === void 0 ? void 0 : e.errors) {
        return e.errors.map((messageError) => messageError.message);
    }
    if (e === null || e === void 0 ? void 0 : e.error) {
        return [e.error];
    }
    return [];
}
//# sourceMappingURL=getErrorString.js.map