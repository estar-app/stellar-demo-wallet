import isEqual from "lodash/isEqual";
import pick from "lodash/pick";
import { useSelector } from "react-redux";
export function useRedux(...keys) {
    return useSelector((state) => pick(state, keys), isEqual);
}
//# sourceMappingURL=useRedux.js.map