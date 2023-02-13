import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Heading3, Loader, TextLink, Modal, Layout, } from "@stellar/design-system";
import { metrics } from "@stellar/frontend-helpers";
import { METRIC_NAMES } from "demo-wallet-shared/build/constants/metricNames";
import { CSS_MODAL_PARENT_ID } from "demo-wallet-shared/build/constants/settings";
import { createRandomAccount } from "ducks/account";
import { ConnectAccount } from "components/ConnectAccount";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, SearchParams } from "types/types.d";
export const Landing = () => {
    const { account } = useRedux("account");
    const [isConnectAccountModalVisible, setIsConnectAccountModalVisible] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        metrics.emitMetric(METRIC_NAMES.viewHome);
    }, []);
    useEffect(() => {
        if (account.status === ActionStatus.SUCCESS && !account.isAuthenticated) {
            navigate(searchParam.update(SearchParams.SECRET_KEY, account.secretKey));
        }
    }, [account.secretKey, account.status, account.isAuthenticated, navigate]);
    const handleCreateAccount = () => {
        dispatch(createRandomAccount());
    };
    const isPending = account.status === ActionStatus.PENDING;
    return (React.createElement(Layout.Inset, null,
        React.createElement("div", { className: "Landing__container" },
            React.createElement(Heading3, null, "Import or generate keypair"),
            React.createElement("div", { className: "Landing__buttons" },
                React.createElement(TextLink, { onClick: () => setIsConnectAccountModalVisible(true), variant: TextLink.variant.secondary, disabled: isPending, underline: true }, "Provide a secret key (testnet only)"),
                React.createElement("div", { className: "Layout__inline" },
                    React.createElement(TextLink, { onClick: handleCreateAccount, variant: TextLink.variant.secondary, disabled: isPending, underline: true }, "Generate keypair for new account (testnet only)"),
                    !isConnectAccountModalVisible && isPending && React.createElement(Loader, null))),
            React.createElement(Modal, { visible: isConnectAccountModalVisible, onClose: () => setIsConnectAccountModalVisible(false), parentId: CSS_MODAL_PARENT_ID },
                React.createElement(ConnectAccount, null)))));
};
//# sourceMappingURL=Landing.js.map