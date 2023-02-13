import { Navigate, useLocation } from "react-router-dom";
import { useRedux } from "hooks/useRedux";
export const PrivateRoute = ({ children, }) => {
    const { account } = useRedux("account");
    const location = useLocation();
    return account.isAuthenticated ? (children) : (React.createElement(Navigate, { to: {
            pathname: "/",
            search: location.search,
        } }));
};
//# sourceMappingURL=PrivateRoute.js.map