import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Keypair } from "stellar-sdk";
import { fetchAccountAction } from "ducks/account";
import { fetchClaimableBalancesAction } from "ducks/claimableBalances";
import { updateSettingsAction } from "ducks/settings";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { log } from "demo-wallet-shared/build/helpers/log";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, SearchParams } from "types/types.d";
export const SettingsHandler = ({ children, }) => {
    const { account } = useRedux("account");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const secretKeyParam = queryParams.get(SearchParams.SECRET_KEY);
    const untrustedAssetsParam = queryParams.get(SearchParams.UNTRUSTED_ASSETS);
    const assetOverridesParam = queryParams.get(SearchParams.ASSET_OVERRIDES);
    const claimableBalanceSupportedParam = queryParams.get(SearchParams.CLAIMABLE_BALANCE_SUPPORTED);
    useEffect(() => {
        dispatch(updateSettingsAction({
            [SearchParams.SECRET_KEY]: secretKeyParam || "",
        }));
        if (secretKeyParam) {
            try {
                const keypair = Keypair.fromSecret(secretKeyParam);
                dispatch(fetchAccountAction({
                    publicKey: keypair.publicKey(),
                    secretKey: keypair.secret(),
                }));
                dispatch(fetchClaimableBalancesAction({ publicKey: keypair.publicKey() }));
            }
            catch (error) {
                log.error({
                    title: "Fetch account error",
                    body: getErrorMessage(error),
                });
            }
        }
    }, [secretKeyParam, dispatch]);
    useEffect(() => {
        const cleanedAssets = untrustedAssetsParam === null || untrustedAssetsParam === void 0 ? void 0 : untrustedAssetsParam.split(",").reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []).join(",");
        dispatch(updateSettingsAction({
            [SearchParams.UNTRUSTED_ASSETS]: cleanedAssets || "",
        }));
    }, [untrustedAssetsParam, dispatch]);
    useEffect(() => {
        dispatch(updateSettingsAction({
            [SearchParams.ASSET_OVERRIDES]: assetOverridesParam || "",
        }));
    }, [assetOverridesParam, dispatch]);
    useEffect(() => {
        dispatch(updateSettingsAction({
            [SearchParams.CLAIMABLE_BALANCE_SUPPORTED]: claimableBalanceSupportedParam === "true",
        }));
    }, [claimableBalanceSupportedParam, dispatch]);
    useEffect(() => {
        if (account.status === ActionStatus.SUCCESS && account.isAuthenticated) {
            navigate({
                pathname: "/account",
                search: location.search,
            });
        }
    }, [account.status, location.search, account.isAuthenticated, navigate]);
    return React.createElement(React.Fragment, null, children);
};
//# sourceMappingURL=SettingsHandler.js.map