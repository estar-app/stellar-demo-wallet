import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletBackendEndpoint, clientDomain } from "config/store";
import { accountSelector } from "ducks/account";
import { settingsSelector } from "ducks/settings";
import { custodialSelector } from "ducks/custodial";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { sep10AuthStart, sep10AuthSign, sep10AuthSend, } from "demo-wallet-shared/build/methods/sep10Auth";
import { checkInfo, interactiveDepositFlow, createPopup, pollDepositUntilComplete, } from "demo-wallet-shared/build/methods/sep24";
import { checkTomlForFields } from "demo-wallet-shared/build/methods/checkTomlForFields";
import { trustAsset } from "demo-wallet-shared/build/methods/trustAsset";
import { ActionStatus, TomlFields, AnchorActionType, } from "types/types.d";
export const depositAssetAction = createAsyncThunk("sep24DepositAsset/depositAssetAction", async (asset, { rejectWithValue, getState }) => {
    const { assetCode, assetIssuer, homeDomain } = asset;
    const { data, secretKey } = accountSelector(getState());
    const { claimableBalanceSupported } = settingsSelector(getState());
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
    log.instruction({ title: "Initiating a SEP-24 deposit" });
    const trustAssetCallback = async () => {
        const assetString = `${assetCode}:${assetIssuer}`;
        await trustAsset({
            secretKey,
            networkPassphrase: networkConfig.network,
            networkUrl: networkConfig.url,
            untrustedAsset: {
                assetString,
                assetCode,
                assetIssuer,
            },
        });
        return assetString;
    };
    try {
        const tomlResponse = await checkTomlForFields({
            sepName: "SEP-24 deposit",
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
            type: AnchorActionType.DEPOSIT,
            toml: tomlResponse,
            assetCode,
        });
        log.instruction({
            title: "SEP-24 deposit is enabled, and requires authentication so we should go through SEP-10",
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
        const generatedMemoId = custodialIsEnabled
            ? Math.floor(Math.random() * 100).toString()
            : undefined;
        const interactiveResponse = await interactiveDepositFlow({
            assetCode,
            publicKey,
            sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
            token,
            claimableBalanceSupported,
            memo: generatedMemoId,
            memoType: custodialIsEnabled ? "id" : undefined,
        });
        const popup = createPopup(interactiveResponse.url);
        const { currentStatus, trustedAssetAdded } = await pollDepositUntilComplete({
            popup,
            transactionId: interactiveResponse.id,
            token,
            sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
            trustAssetCallback,
            custodialMemoId: generatedMemoId,
        });
        return {
            currentStatus,
            trustedAssetAdded,
        };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({
            title: "SEP-24 deposit failed",
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
        trustedAssetAdded: undefined,
    },
    status: undefined,
    errorString: undefined,
};
const sep24DepositAssetSlice = createSlice({
    name: "sep24DepositAsset",
    initialState,
    reducers: {
        resetSep24DepositAssetAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(depositAssetAction.pending, (state) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(depositAssetAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(depositAssetAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const { reducer } = sep24DepositAssetSlice;
export const { resetSep24DepositAssetAction } = sep24DepositAssetSlice.actions;
//# sourceMappingURL=sep24DepositAsset.js.map