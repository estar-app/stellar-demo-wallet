import { Heading2, TextLink, Layout } from "@stellar/design-system";
import { useDispatch } from "react-redux";
import { BalanceRow } from "components/BalanceRow";
import { claimAssetAction } from "ducks/claimAsset";
import { useRedux } from "hooks/useRedux";
export const ClaimableBalance = ({ onAssetAction, }) => {
    const { activeAsset, claimableBalances } = useRedux("activeAsset", "claimableBalances");
    const balances = claimableBalances.data.records;
    const dispatch = useDispatch();
    const handleClaim = (balance) => {
        onAssetAction({
            assetString: balance.assetString,
            balance,
            title: `Claim balance ${balance.assetCode}`,
            description: `Claimable balance description ${balance.total} ${balance.assetCode}`,
            callback: () => dispatch(claimAssetAction(balance)),
        });
    };
    if (!balances || !balances.length) {
        return null;
    }
    return (React.createElement("div", { className: "ClaimableBalances" },
        React.createElement(Layout.Inset, null,
            React.createElement(Heading2, null, "Claimable Balances")),
        React.createElement("div", { className: "Balances" }, balances.map((balance) => (React.createElement(BalanceRow, { activeAction: activeAsset.action, key: balance.assetString, asset: balance },
            React.createElement(TextLink, { onClick: () => handleClaim(balance), disabled: Boolean(activeAsset.action) }, "Claim")))))));
};
//# sourceMappingURL=ClaimableBalance.js.map