export var SearchParams;
(function (SearchParams) {
    SearchParams["SECRET_KEY"] = "secretKey";
    SearchParams["UNTRUSTED_ASSETS"] = "untrustedAssets";
    SearchParams["ASSET_OVERRIDES"] = "assetOverrides";
    SearchParams["CLAIMABLE_BALANCE_SUPPORTED"] = "claimableBalanceSupported";
})(SearchParams || (SearchParams = {}));
export var AssetCategory;
(function (AssetCategory) {
    AssetCategory["TRUSTED"] = "trusted";
    AssetCategory["UNTRUSTED"] = "untrusted";
})(AssetCategory || (AssetCategory = {}));
export var TomlFields;
(function (TomlFields) {
    TomlFields["ACCOUNTS"] = "ACCOUNTS";
    TomlFields["AUTH_SERVER"] = "AUTH_SERVER";
    TomlFields["DIRECT_PAYMENT_SERVER"] = "DIRECT_PAYMENT_SERVER";
    TomlFields["FEDERATION_SERVER"] = "FEDERATION_SERVER";
    TomlFields["HORIZON_URL"] = "HORIZON_URL";
    TomlFields["KYC_SERVER"] = "KYC_SERVER";
    TomlFields["NETWORK_PASSPHRASE"] = "NETWORK_PASSPHRASE";
    TomlFields["SIGNING_KEY"] = "SIGNING_KEY";
    TomlFields["TRANSFER_SERVER"] = "TRANSFER_SERVER";
    TomlFields["TRANSFER_SERVER_SEP0024"] = "TRANSFER_SERVER_SEP0024";
    TomlFields["URI_REQUEST_SIGNING_KEY"] = "URI_REQUEST_SIGNING_KEY";
    TomlFields["VERSION"] = "VERSION";
    TomlFields["WEB_AUTH_ENDPOINT"] = "WEB_AUTH_ENDPOINT";
})(TomlFields || (TomlFields = {}));
export var LogType;
(function (LogType) {
    LogType["REQUEST"] = "request";
    LogType["RESPONSE"] = "response";
    LogType["INSTRUCTION"] = "instruction";
    LogType["ERROR"] = "error";
    LogType["WARNING"] = "warning";
})(LogType || (LogType = {}));
export var ActionStatus;
(function (ActionStatus) {
    ActionStatus["ERROR"] = "ERROR";
    ActionStatus["PENDING"] = "PENDING";
    ActionStatus["SUCCESS"] = "SUCCESS";
    ActionStatus["NEEDS_INPUT"] = "NEEDS_INPUT";
    ActionStatus["CAN_PROCEED"] = "CAN_PROCEED";
})(ActionStatus || (ActionStatus = {}));
export var AssetActionId;
(function (AssetActionId) {
    AssetActionId["SEND_PAYMENT"] = "send-payment";
    AssetActionId["SEP6_DEPOSIT"] = "sep6-deposit";
    AssetActionId["SEP6_WITHDRAW"] = "sep6-withdraw";
    AssetActionId["SEP8_SEND_PAYMENT"] = "sep8-send-payment";
    AssetActionId["SEP24_DEPOSIT"] = "sep24-deposit";
    AssetActionId["SEP24_WITHDRAW"] = "sep24-withdraw";
    AssetActionId["SEP31_SEND"] = "sep31-send";
    AssetActionId["TRUST_ASSET"] = "trust-asset";
    AssetActionId["REMOVE_ASSET"] = "remove-asset";
    AssetActionId["ADD_ASSET_OVERRIDE"] = "add-asset-override";
    AssetActionId["REMOVE_ASSET_OVERRIDE"] = "remove-asset-override";
})(AssetActionId || (AssetActionId = {}));
export var AssetType;
(function (AssetType) {
    AssetType["NATIVE"] = "native";
})(AssetType || (AssetType = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["ERROR"] = "error";
    TransactionStatus["INCOMPLETE"] = "incomplete";
    TransactionStatus["PENDING_ANCHOR"] = "pending_anchor";
    TransactionStatus["PENDING_CUSTOMER_INFO_UPDATE"] = "pending_customer_info_update";
    TransactionStatus["PENDING_EXTERNAL"] = "pending_external";
    TransactionStatus["PENDING_RECEIVER"] = "pending_receiver";
    TransactionStatus["PENDING_SENDER"] = "pending_sender";
    TransactionStatus["PENDING_STELLAR"] = "pending_stellar";
    TransactionStatus["PENDING_TRANSACTION_INFO_UPDATE"] = "pending_transaction_info_update";
    TransactionStatus["PENDING_TRUST"] = "pending_trust";
    TransactionStatus["PENDING_USER"] = "pending_user";
    TransactionStatus["PENDING_USER_TRANSFER_START"] = "pending_user_transfer_start";
})(TransactionStatus || (TransactionStatus = {}));
export var MemoTypeString;
(function (MemoTypeString) {
    MemoTypeString["TEXT"] = "text";
    MemoTypeString["ID"] = "id";
    MemoTypeString["HASH"] = "hash";
})(MemoTypeString || (MemoTypeString = {}));
export var AnchorActionType;
(function (AnchorActionType) {
    AnchorActionType["DEPOSIT"] = "deposit";
    AnchorActionType["WITHDRAWAL"] = "withdraw";
})(AnchorActionType || (AnchorActionType = {}));
export var Sep8ApprovalStatus;
(function (Sep8ApprovalStatus) {
    Sep8ApprovalStatus["ACTION_REQUIRED"] = "action_required";
    Sep8ApprovalStatus["PENDING"] = "pending";
    Sep8ApprovalStatus["REJECTED"] = "rejected";
    Sep8ApprovalStatus["REVISED"] = "revised";
    Sep8ApprovalStatus["SUCCESS"] = "success";
})(Sep8ApprovalStatus || (Sep8ApprovalStatus = {}));
export var Sep8Step;
(function (Sep8Step) {
    Sep8Step["DISABLED"] = "disabled";
    Sep8Step["STARTING"] = "starting";
    Sep8Step["PENDING"] = "pending";
    Sep8Step["TRANSACTION_REVISED"] = "transaction_revised";
    Sep8Step["ACTION_REQUIRED"] = "action_required";
    Sep8Step["SENT_ACTION_REQUIRED_FIELDS"] = "sent_action_required_fields";
    Sep8Step["COMPLETE"] = "complete";
})(Sep8Step || (Sep8Step = {}));
export var Sep8ActionRequiredResultType;
(function (Sep8ActionRequiredResultType) {
    Sep8ActionRequiredResultType["FOLLOW_NEXT_URL"] = "follow_next_url";
    Sep8ActionRequiredResultType["NO_FURTHER_ACTION_REQUIRED"] = "no_further_action_required";
})(Sep8ActionRequiredResultType || (Sep8ActionRequiredResultType = {}));
export var Sep12CustomerStatus;
(function (Sep12CustomerStatus) {
    Sep12CustomerStatus["ACCEPTED"] = "ACCEPTED";
    Sep12CustomerStatus["PROCESSING"] = "PROCESSING";
    Sep12CustomerStatus["NEEDS_INFO"] = "NEEDS_INFO";
    Sep12CustomerStatus["REJECTED"] = "REJECTED";
})(Sep12CustomerStatus || (Sep12CustomerStatus = {}));
export var Sep12CustomerFieldStatus;
(function (Sep12CustomerFieldStatus) {
    Sep12CustomerFieldStatus["ACCEPTED"] = "ACCEPTED";
    Sep12CustomerFieldStatus["PROCESSING"] = "PROCESSING";
    Sep12CustomerFieldStatus["NOT_PROVIDED"] = "NOT_PROVIDED";
    Sep12CustomerFieldStatus["REJECTED"] = "REJECTED";
    Sep12CustomerFieldStatus["VERIFICATION_REQUIRED"] = "VERIFICATION_REQUIRED";
})(Sep12CustomerFieldStatus || (Sep12CustomerFieldStatus = {}));
//# sourceMappingURL=types.js.map