import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, TextLink, Icon, InfoBlock, Modal, CopyText, } from "@stellar/design-system";
import { resetStoreAction } from "config/store";
import { getCurrentSessionParams } from "demo-wallet-shared/build/helpers/getCurrentSessionParams";
import { SearchParams } from "types/types.d";
export const SignOutModal = ({ onClose }) => {
    const [sessionParams, setSessionParams] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        setSessionParams(getCurrentSessionParams());
    }, []);
    const handleSignOut = () => {
        dispatch(resetStoreAction());
        navigate({
            pathname: "/",
        });
        onClose();
    };
    const getMessageText = () => {
        const paramText = {
            [SearchParams.ASSET_OVERRIDES]: "home domain overrides",
            [SearchParams.UNTRUSTED_ASSETS]: "untrusted assets",
            [SearchParams.CLAIMABLE_BALANCE_SUPPORTED]: "claimable balance supported",
        };
        return sessionParams.map((s) => paramText[s]).join(", ");
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Body, null,
            React.createElement("p", null, "You can reload the account using your secret key or press back in your browser to sign back in."),
            sessionParams.length > 0 && (React.createElement(InfoBlock, { variant: InfoBlock.variant.warning },
                React.createElement("p", null, `You have session data (${getMessageText()}) that will be lost when you sign out. You can copy the URL to save it.`),
                React.createElement("div", { className: "SessionParamsWrapper" },
                    React.createElement(CopyText, { textToCopy: window.location.toString(), tooltipPosition: CopyText.tooltipPosition.RIGHT, showTooltip: true },
                        React.createElement(TextLink, { iconLeft: React.createElement(Icon.Copy, null) }, "Copy URL")))))),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSignOut }, "Sign out"),
            React.createElement(Button, { variant: Button.variant.secondary, onClick: onClose }, "Go back"))));
};
//# sourceMappingURL=SignOutModal.js.map