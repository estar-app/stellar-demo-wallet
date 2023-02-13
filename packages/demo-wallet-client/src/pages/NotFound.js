import { useNavigate, useLocation } from "react-router-dom";
import { Button, Heading1, Layout, Eyebrow } from "@stellar/design-system";
export const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleBack = () => {
        navigate({ pathname: "/", search: location.search });
    };
    return (React.createElement(Layout.Inset, null,
        React.createElement("div", { className: "NotFoundPage" },
            React.createElement(Eyebrow, null, "Error 404"),
            React.createElement(Heading1, null, "Sorry, that page couldn\u2019t be found."),
            React.createElement("p", null, "Have you tried turning it off and on again?"),
            React.createElement(Button, { onClick: handleBack }, "Go back"))));
};
//# sourceMappingURL=NotFound.js.map