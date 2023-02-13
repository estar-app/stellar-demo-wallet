import { useState } from "react";
import { Button, Input, Modal } from "@stellar/design-system";
import { useNavigate } from "react-router-dom";
import { searchParam } from "demo-wallet-shared/build/helpers/searchParam";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, SearchParams } from "types/types.d";
export const ConnectAccount = () => {
    const { account } = useRedux("account");
    const [secretKey, setSecretKey] = useState("");
    const navigate = useNavigate();
    const handleSetSecretKey = () => {
        navigate(searchParam.update(SearchParams.SECRET_KEY, secretKey));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal.Heading, null, "Connect with a secret key"),
        React.createElement(Modal.Body, null,
            React.createElement(Input, { id: "secretKey", label: "Your secret key", onChange: (e) => setSecretKey(e.target.value), value: secretKey, placeholder: "Starts with S, example: SCHK\u2026ZLJK" })),
        React.createElement(Modal.Footer, null,
            React.createElement(Button, { onClick: handleSetSecretKey, disabled: !secretKey, isLoading: account.status === ActionStatus.PENDING }, "Connect"))));
};
//# sourceMappingURL=ConnectAccount.js.map