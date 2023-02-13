import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    assetOverrides: "",
    secretKey: "",
    untrustedAssets: "",
    claimableBalanceSupported: false,
};
const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateSettingsAction: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
});
export const settingsSelector = (state) => state.settings;
export const { reducer } = settingsSlice;
export const { updateSettingsAction } = settingsSlice.actions;
//# sourceMappingURL=settings.js.map