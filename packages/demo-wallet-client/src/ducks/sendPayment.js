import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { settingsSelector } from "ducks/settings";
import { getErrorString } from "demo-wallet-shared/build/helpers/getErrorString";
import { log } from "demo-wallet-shared/build/helpers/log";
import { submitPaymentTransaction } from "demo-wallet-shared/build/methods/submitPaymentTransaction";
import { ActionStatus, } from "types/types.d";
export const sendPaymentAction = createAsyncThunk("sendPayment/sendPaymentAction", async (params, { rejectWithValue, getState }) => {
    const { secretKey } = settingsSelector(getState());
    let result;
    try {
        result = await submitPaymentTransaction({
            params,
            secretKey,
        });
    }
    catch (error) {
        const errorString = getErrorString(error);
        log.error({ title: errorString });
        return rejectWithValue({
            errorString,
        });
    }
    return result;
});
const initialState = {
    data: null,
    status: undefined,
    errorString: undefined,
};
const sendPaymentSlice = createSlice({
    name: "sendPayment",
    initialState,
    reducers: {
        resetSendPaymentAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(sendPaymentAction.pending, (state) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(sendPaymentAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(sendPaymentAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const { reducer } = sendPaymentSlice;
export const { resetSendPaymentAction } = sendPaymentSlice.actions;
//# sourceMappingURL=sendPayment.js.map