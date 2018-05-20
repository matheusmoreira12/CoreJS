var Core;
(function (Core) {
    var HashCode;
    (function (HashCode) {
        function fromString(str) {
            let outHashCode = 0;
            if (str.length === 0)
                return outHashCode;
            for (let i = 0; i < str.length; i++) {
                let chr = str.charCodeAt(i);
                outHashCode = ((outHashCode << 5) - outHashCode) + chr;
            }
            return outHashCode;
        }
        HashCode.fromString = fromString;
        function concatenate(hashCodes) {
            let outHashCode = 17;
            for (let hashCode of hashCodes)
                outHashCode = ((outHashCode << 5) - outHashCode) + hashCode;
            return outHashCode;
        }
        HashCode.concatenate = concatenate;
    })(HashCode = Core.HashCode || (Core.HashCode = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.HashCode.js.map