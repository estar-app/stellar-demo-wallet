import { Memo, MemoHash, MemoID, MemoText } from "stellar-sdk";
export const createMemoFromType = (memoString, memoType) => {
    let memo;
    switch (memoType) {
        case "hash":
            memo = new Memo(MemoHash, Buffer.from(memoString, "base64").toString("hex"));
            break;
        case "id":
            memo = new Memo(MemoID, memoString);
            break;
        case "text":
            memo = new Memo(MemoText, memoString);
            break;
        default:
    }
    if (!memo) {
        throw new Error(`Invalid memo_type: ${memoString} (${memoType})`);
    }
    return memo;
};
//# sourceMappingURL=createMemoFromType.js.map