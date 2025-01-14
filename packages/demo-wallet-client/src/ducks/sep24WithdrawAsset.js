import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletBackendEndpoint, clientDomain } from "config/store";
import { accountSelector } from "ducks/account";
import { custodialSelector } from "ducks/custodial";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { sep10AuthStart, sep10AuthSign, sep10AuthSend, } from "demo-wallet-shared/build/methods/sep10Auth";
import { checkInfo, interactiveWithdrawFlow, createPopup, pollWithdrawUntilComplete, } from "demo-wallet-shared/build/methods/sep24";
import { checkTomlForFields } from "demo-wallet-shared/build/methods/checkTomlForFields";
import { ActionStatus, TomlFields, AnchorActionType, } from "types/types.d";
export const withdrawAssetAction = createAsyncThunk("sep24WithdrawAsset/withdrawAssetAction", async (asset, { rejectWithValue, getState }) => {
    const { assetIssuer, assetCode, homeDomain } = asset;
    const { data, secretKey } = accountSelector(getState());
    const { isEnabled: custodialIsEnabled, secretKey: custodialSecretKey, publicKey: custodialPublicKey, memoId: custodialMemoId, } = custodialSelector(getState());
    const networkConfig = getNetworkConfig();
    const publicKey = data === null || data === void 0 ? void 0 : data.id;
    if (!publicKey) {
        throw new Error("Something is wrong with Account, no public key.");
    }
    if (!homeDomain) {
        throw new Error("Something went wrong, home domain is not defined.");
    }
    if (custodialIsEnabled &&
        !(custodialSecretKey && custodialPublicKey && custodialMemoId)) {
        throw new Error("Custodial mode requires secret key, public key, and memo ID");
    }
    try {
        const tomlResponse = await checkTomlForFields({
            sepName: "SEP-24 withdrawal",
            assetIssuer,
            requiredKeys: [
                TomlFields.SIGNING_KEY,
                TomlFields.TRANSFER_SERVER_SEP0024,
                TomlFields.WEB_AUTH_ENDPOINT,
            ],
            networkUrl: networkConfig.url,
            homeDomain,
        });
        await checkInfo({
            type: AnchorActionType.WITHDRAWAL,
            toml: tomlResponse,
            assetCode,
        });
        log.instruction({
            title: "SEP-24 withdrawal is enabled, and requires authentication so we should go through SEP-10",
        });
        const serviceDomain = new URL(tomlResponse.TRANSFER_SERVER_SEP0024).host;
        const challengeTransaction = await sep10AuthStart({
            authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
            serverSigningKey: tomlResponse.SIGNING_KEY,
            publicKey: custodialPublicKey || publicKey,
            homeDomain: serviceDomain,
            clientDomain,
            memoId: custodialMemoId,
        });
        const signedChallengeTransaction = await sep10AuthSign({
            secretKey: custodialSecretKey || secretKey,
            networkPassphrase: networkConfig.network,
            challengeTransaction,
            walletBackendEndpoint,
        });
        const token = await sep10AuthSend({
            authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
            signedChallengeTransaction,
        });
        const interactiveResponse = await interactiveWithdrawFlow({
            assetCode,
            publicKey,
            sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
            token,
        });
        const popup = createPopup(interactiveResponse.url);
        const currentStatus = await pollWithdrawUntilComplete({
            secretKey,
            popup,
            transactionId: interactiveResponse.id,
            token,
            sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
            networkPassphrase: networkConfig.network,
            networkUrl: networkConfig.url,
            assetCode,
            assetIssuer,
        });
        return {
            currentStatus,
        };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({
            title: "SEP-24 withdrawal failed",
            body: errorMessage,
        });
        return rejectWithValue({
            errorString: errorMessage,
        });
    }
});
const initialState = {
    data: {
        currentStatus: "",
    },
    status: undefined,
    errorString: undefined,
};
const sep24WithdrawAssetSlice = createSlice({
    name: "sep24WithdrawAsset",
    initialState,
    reducers: {
        resetSep24WithdrawAssetAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(withdrawAssetAction.pending, (state) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(withdrawAssetAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(withdrawAssetAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const { reducer } = sep24WithdrawAssetSlice;
export const { resetSep24WithdrawAssetAction } = sep24WithdrawAssetSlice.actions;
//# sourceMappingURL=sep24WithdrawAsset.js.map