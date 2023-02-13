import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isEnabled: false,
    secretKey: "",
    publicKey: "",
    memoId: "",
};
const custodialSlice = createSlice({
    name: "custodial",
    initialState,
    reducers: {
        resetCustodialAction: () => initialState,
        updateCustodialAction: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
});
export const custodialSelector = (state) => state.custodial;
export const { reducer } = custodialSlice;
export const { updateCustodialAction, resetCustodialAction } = custodialSlice.actions;
//# sourceMappingURL=custodial.js.map