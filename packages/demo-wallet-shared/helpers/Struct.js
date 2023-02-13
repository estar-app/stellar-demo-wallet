const SKIPPING_PROPS = [
    "_reactFragment",
    "@@toStringTag",
    "$$typeof",
    "asymmetricMatch",
    "prototype",
];
export function Struct(mapping) {
    const proxy = new Proxy(mapping, {
        get(target, name) {
            if (name === "toJSON") {
                return () => target;
            }
            if (name in target) {
                return target[name];
            }
            if (SKIPPING_PROPS.includes(name) || name.constructor === Symbol) {
                return target[name];
            }
            throw new Error(`[Struct] Tried to access missing property name: ${name.toString()}, object is ${JSON.stringify(target)}`);
        },
        set(_, name) {
            throw new Error(`[Struct] Cannot set property: ${name}}`);
        },
    });
    return proxy;
}
//# sourceMappingURL=Struct.js.map