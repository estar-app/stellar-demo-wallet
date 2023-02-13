export const normalizeHomeDomainUrl = (homeDomain) => {
    let _homeDomain = homeDomain;
    if (_homeDomain.includes("localhost")) {
        _homeDomain = _homeDomain.startsWith("http")
            ? _homeDomain
            : `http://${_homeDomain}`;
    }
    else {
        _homeDomain = _homeDomain.startsWith("http")
            ? _homeDomain
            : `https://${_homeDomain}`;
    }
    return new URL(_homeDomain.replace(/\/$/, ""));
};
//# sourceMappingURL=normalizeHomeDomainUrl.js.map