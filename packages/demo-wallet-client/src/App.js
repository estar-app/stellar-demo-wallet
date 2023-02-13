import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout, TextLink } from "@stellar/design-system";
import { errorReporting } from "@stellar/frontend-helpers";
import { store } from "config/store";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { Logs } from "components/Logs";
import { PrivateRoute } from "components/PrivateRoute";
import { SettingsHandler } from "components/SettingsHandler";
import { WarningBanner } from "components/WarningBanner";
import { Account } from "pages/Account";
import { Landing } from "pages/Landing";
import { NotFound } from "pages/NotFound";
import "./App.scss";
const maskSecretKey = (text) => text.replace(/secretKey=S(.*?)([&]|$)/g, "secretKey=S***&");
errorReporting.reportErrors({
    projectName: "demo-wallet",
    tracingOrigins: [/^\/[^/]/],
    extra: {
        beforeBreadcrumb: (breadcrumb) => {
            if (breadcrumb.data) {
                breadcrumb.data = {
                    ...breadcrumb.data,
                    ...(breadcrumb.data.from
                        ? { from: maskSecretKey(breadcrumb.data.from) }
                        : {}),
                    ...(breadcrumb.data.to
                        ? { to: maskSecretKey(breadcrumb.data.to) }
                        : {}),
                };
            }
            return breadcrumb;
        },
    },
});
export const App = () => (React.createElement(Provider, { store: store },
    React.createElement(Router, null,
        React.createElement(SettingsHandler, null,
            React.createElement(WarningBanner, null),
            React.createElement("div", { id: "app-wrapper", className: "Wrapper" },
                React.createElement("div", { className: "SplitContainer Main" },
                    React.createElement("div", { className: "Main__content" },
                        React.createElement(Header, null),
                        React.createElement(Layout.Content, null,
                            React.createElement(Layout.Inset, null,
                                React.createElement("p", null, "This demo wallet lets financial application developers test their integrations and learn how Stellar ecosystem protocols (SEPs) work."),
                                React.createElement("p", null,
                                    React.createElement(TextLink, { variant: TextLink.variant.secondary, underline: true, href: "https://github.com/stellar/stellar-demo-wallet#stellar-demo-wallet" }, "How to use this tool"),
                                    React.createElement("br", null),
                                    React.createElement(TextLink, { variant: TextLink.variant.secondary, underline: true, href: "https://github.com/stellar/stellar-demo-wallet/issues" }, "Report issues or request features"),
                                    " ",
                                    "on GitHub")),
                            React.createElement(Routes, null,
                                React.createElement(Route, { path: "/", element: React.createElement(Landing, null) }),
                                React.createElement(Route, { path: "/account", element: React.createElement(PrivateRoute, null,
                                        React.createElement(Account, null)) }),
                                React.createElement(Route, { element: NotFound }))),
                        React.createElement(Footer, null))),
                React.createElement(Logs, null))))));
//# sourceMappingURL=App.js.map