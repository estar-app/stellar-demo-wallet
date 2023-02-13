import { URL_ITEM_SEPARATOR_CHAR, URL_KEY_PAIR_SEPARATOR_CHAR, } from "../constants/settings";
import { searchKeyPairStringToArray } from "./searchKeyPairStringToArray";
import { SearchParams } from "../types/types";
const update = (param, value, urlSearchParams) => {
    const queryParams = urlSearchParams || new URLSearchParams(window.location.search);
    const currentParamValue = queryParams.get(param) || "";
    switch (param) {
        case SearchParams.CLAIMABLE_BALANCE_SUPPORTED:
            if (value === "true") {
                queryParams.set(SearchParams.CLAIMABLE_BALANCE_SUPPORTED, value);
            }
            else {
                queryParams.delete(SearchParams.CLAIMABLE_BALANCE_SUPPORTED);
            }
            break;
        case SearchParams.SECRET_KEY:
            queryParams.set(SearchParams.SECRET_KEY, value);
            break;
        case SearchParams.UNTRUSTED_ASSETS:
            queryParams.set(SearchParams.UNTRUSTED_ASSETS, updateValue({ currentVal: currentParamValue, newVal: value }));
            break;
        default:
            throw new Error(`Search param \`${searchParam}\` does not exist`);
    }
    return `?${queryParams.toString()}`;
};
const remove = (param, removeValue, urlSearchParams) => {
    const queryParams = urlSearchParams || new URLSearchParams(window.location.search);
    const currentParamValue = queryParams.get(param) || "";
    const updatedValue = updateValue({
        currentVal: currentParamValue,
        removeVal: removeValue,
    });
    if (updatedValue) {
        queryParams.set(param, updatedValue);
    }
    else {
        queryParams.delete(param);
    }
    return `?${queryParams.toString()}`;
};
const updateKeyPair = ({ param, itemId, keyPairs, urlSearchParams, }) => {
    const queryParams = urlSearchParams || new URLSearchParams(window.location.search);
    const currentParamValue = queryParams.get(param) || "";
    const valuesArray = currentParamValue ? currentParamValue.split(",") : [];
    const assetArray = searchKeyPairStringToArray(currentParamValue);
    const isExistingItem = assetArray.find((v) => v.assetString === itemId);
    if (isExistingItem) {
        const updatedValuesArray = assetArray.reduce((result, asset) => {
            if (asset.assetString === itemId) {
                return [...result, { ...asset, ...keyPairs }];
            }
            return [...result, asset];
        }, []);
        const updatedValuesString = updatedValuesArray.reduce((result, asset) => [
            ...result,
            `${asset.assetString}${URL_ITEM_SEPARATOR_CHAR}${getKeyPairString(asset)}`,
        ], []);
        queryParams.set(param, updatedValuesString.join(","));
    }
    else {
        const updatedValue = [
            ...valuesArray,
            `${itemId}${URL_ITEM_SEPARATOR_CHAR}${getKeyPairString(keyPairs)}`,
        ].join(",");
        queryParams.set(param, updatedValue);
    }
    return `?${queryParams.toString()}`;
};
const removeKeyPair = ({ param, itemId, urlSearchParams, }) => {
    const queryParams = urlSearchParams || new URLSearchParams(window.location.search);
    const currentParamValue = queryParams.get(param) || "";
    const assetArray = searchKeyPairStringToArray(currentParamValue);
    const assetsToKeep = assetArray.filter((v) => v.assetString !== itemId);
    if (assetsToKeep.length) {
        const updatedValuesString = assetsToKeep.reduce((result, asset) => [
            ...result,
            `${asset.assetString}${URL_ITEM_SEPARATOR_CHAR}${getKeyPairString(asset)}`,
        ], []);
        queryParams.set(param, updatedValuesString.join(","));
    }
    else {
        queryParams.delete(param);
    }
    return `?${queryParams.toString()}`;
};
const updateValue = ({ currentVal, newVal, removeVal }) => {
    const valuesArray = currentVal ? currentVal.split(",") : [];
    if (newVal) {
        if (valuesArray.includes(newVal)) {
            throw new Error(`${newVal} was already added`);
        }
        return [...valuesArray, newVal].join(",");
    }
    if (removeVal) {
        const valuesToKeep = valuesArray.filter((value) => value !== removeVal);
        return valuesToKeep.join(",");
    }
    return currentVal;
};
const getKeyPairString = (keyPairs) => {
    const arr = Object.entries(keyPairs).reduce((result, [key, value]) => {
        if (key !== "assetString") {
            return [...result, `${key}${URL_KEY_PAIR_SEPARATOR_CHAR}${value}`];
        }
        return result;
    }, []);
    return `${arr.join(URL_ITEM_SEPARATOR_CHAR)}`;
};
export const searchParam = {
    update,
    remove,
    updateKeyPair,
    removeKeyPair,
};
//# sourceMappingURL=searchParam.js.map