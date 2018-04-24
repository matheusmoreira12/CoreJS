var Markup;
(function (Markup) {
    let Patterns;
    (function (Patterns) {
        function concatPatterns(...patterns) {
            return patterns.join("");
        }
        function combinePatterns(...patterns) {
            return patterns.join("|");
        }
        Patterns.OXML_NAME_PATTERN = "[a-zA-Z$_]\\w*";
        Patterns.OXML_SCHEMA_PREFIX_PATTERN = "(-?[a-zA-Z_]\w*)*?";
        Patterns.OXML_SCHEMA_URI_URL_PATTERN = "([a-z][a-z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\\3)@)?(?=(\\[[0-9A-F:.]{2,}\\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\10)?)(?:\\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\12)?";
        Patterns.OXML_SCHEMA_URI_NAMESPACE_PATTERN = "clr-namespace;\s*?(?<namespace>(.?[a-zA-Z_]\\w*)+)";
        Patterns.OXML_SCHEMA_URI_PATTERN = combinePatterns(Patterns.OXML_SCHEMA_URI_NAMESPACE_PATTERN, Patterns.OXML_SCHEMA_URI_URL_PATTERN);
        // Returns a regex created from the specified pattern that only matches the whole string.
        function getRegexFromPatternMatchWhole(pattern) {
            return new RegExp(`^${pattern}$`);
        }
        Patterns.getRegexFromPatternMatchWhole = getRegexFromPatternMatchWhole;
    })(Patterns || (Patterns = {}));
    const OXML_NAME_REGEX = Patterns.getRegexFromPatternMatchWhole(Patterns.OXML_NAME_PATTERN);
    const OXML_SCHEMA_URI_REGEX = Patterns.getRegexFromPatternMatchWhole(Patterns.OXML_SCHEMA_URI_PATTERN);
    const OXML_SCHEMA_PREFIX_REGEX = Patterns.getRegexFromPatternMatchWhole(Patterns.OXML_SCHEMA_PREFIX_PATTERN);
    class OxmlSchemaPrefix extends String {
        constructor(value) {
            if (!OxmlSchemaPrefix.valueIsValid(value))
                throw new SyntaxError("Invalid OXML schema prefix.");
            super(value);
        }
        static valueIsValid(value) {
            return OXML_SCHEMA_PREFIX_REGEX.test(String(value));
        }
    }
    Markup.OxmlSchemaPrefix = OxmlSchemaPrefix;
    class OxmlSchemaURI extends String {
        constructor(value) {
            if (!OxmlSchemaURI.valueIsValid(value))
                throw new SyntaxError("Invalid OXML schema URI.");
            super(value);
        }
        static valueIsValid(value) {
            return OXML_SCHEMA_URI_REGEX.test(String(value));
        }
    }
    Markup.OxmlSchemaURI = OxmlSchemaURI;
    let OxmlSchemaInfoSymbols;
    (function (OxmlSchemaInfoSymbols) {
        OxmlSchemaInfoSymbols.prefix = Symbol("name");
        OxmlSchemaInfoSymbols.uri = Symbol("uri");
    })(OxmlSchemaInfoSymbols = Markup.OxmlSchemaInfoSymbols || (Markup.OxmlSchemaInfoSymbols = {}));
    class OxmlSchemaInfo {
        constructor(prefix, uri) {
            this[OxmlSchemaInfoSymbols.prefix] = name;
            this[OxmlSchemaInfoSymbols.uri] = uri;
        }
        get name() {
            return this[OxmlSchemaInfoSymbols.prefix];
        }
        get uri() {
            return this[OxmlSchemaInfoSymbols.uri];
        }
    }
    Markup.OxmlSchemaInfo = OxmlSchemaInfo;
    class OxmlName extends String {
        constructor(value) {
            if (value === null)
                return null;
            if (!OxmlName.valueIsValid(value))
                throw new SyntaxError("Invalid OXML name.");
            super(value);
        }
        static valueIsValid(value) {
            return OXML_NAME_REGEX.test(String(value));
        }
    }
    Markup.OxmlName = OxmlName;
    let ObjectSymbols;
    (function (ObjectSymbols) {
        ObjectSymbols.name = Symbol("name");
        ObjectSymbols.prefix = Symbol("prefix");
        ObjectSymbols.members = Symbol("members");
    })(ObjectSymbols || (ObjectSymbols = {}));
    class Object {
        constructor(name, prefix) {
            this[ObjectSymbols.name] = name;
            this[ObjectSymbols.prefix] = prefix;
            this[ObjectSymbols.members] = [];
        }
        get name() {
            return this[ObjectSymbols.name];
        }
        get prefix() {
            return this[ObjectSymbols.prefix];
        }
        get members() {
            return this[ObjectSymbols.members];
        }
    }
    Markup.Object = Object;
    let MemberSymbols;
    (function (MemberSymbols) {
        MemberSymbols.name = Symbol("name");
        MemberSymbols.target = Symbol("target");
    })(MemberSymbols || (MemberSymbols = {}));
    class Member {
        constructor(name, target) {
            this[MemberSymbols.name] = name;
            this[MemberSymbols.target] = target;
        }
        get name() {
            return this[MemberSymbols.name];
        }
        get for() {
            return this[MemberSymbols.target];
        }
    }
    Markup.Member = Member;
})(Markup || (Markup = {}));
//# sourceMappingURL=ObjectiveXMLCompiler.js.map