import { getCatchError } from "@stellar/frontend-helpers";
export const getErrorMessage = (error) => {
    const e = getCatchError(error);
    return e.message || e.toString();
};
//# sourceMappingURL=getErrorMessage.js.map