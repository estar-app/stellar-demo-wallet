import { URL_KEY_PAIR_SEPARATOR_CHAR } from "../constants/settings";
export const searchKeyPairStringToArray = (keyPairString) => {
    const valuesArray = keyPairString ? keyPairString.split(",") : [];
    if (!valuesArray.length) {
        return [];
    }
    return valuesArray.reduce((result, item) => {
        const paramArr = item.split("|");
        const id = paramArr[0];
        const values = paramArr
            .splice(1, paramArr.length - 1)
            .reduce((paramRes, val) => {
            const [key, value] = val.split(URL_KEY_PAIR_SEPARATOR_CHAR);
            return { ...paramRes, [key]: value };
        }, {});
        return [...result, { assetString: id, ...values }];
    }, []);
};
//# sourceMappingURL=searchKeyPairStringToArray.js.map