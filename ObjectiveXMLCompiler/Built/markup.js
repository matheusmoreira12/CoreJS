var Markup;
(function (Markup) {
    let Patterns;
    (function (Patterns) {
        const OXML_NAME_MEMBER_PATTERN = "[a-zA-Z_]\\w*";
        Patterns.OXML_NAME_PATTERN = `(${OXML_NAME_MEMBER_PATTERN})(.${OXML_NAME_MEMBER_PATTERN})*`;
        Patterns.OXML_SCHEMA_URI_URL_PATTERN = "([a-z][a-z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\\3)@)?(?=(\\[[0-9A-F:.]{2,}\\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\10)?)(?:\\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\12)?";
        Patterns.OXML_SCHEMA_URI_NAMESPACE_PATTERN = "clr-namespace;\s*?(.?[a-zA-Z_]\\w*)+";
        // Returns a regex created from the specified pattern that only matches the whole string.
        function getRegexMatchWhole(pattern) {
            return new RegExp(`^${pattern}$`);
        }
        Patterns.getRegexMatchWhole = getRegexMatchWhole;
    })(Patterns || (Patterns = {}));
    const OXML_NAME_REGEX = Patterns.getRegexMatchWhole(Patterns.OXML_NAME_PATTERN);
    const OXML_SCHEMA_URI_URL_REGEX = Patterns.getRegexMatchWhole(Patterns.OXML_SCHEMA_URI_URL_PATTERN);
    const OXML_SCHEMA_URI_NAMESPACE_REGEX = Patterns.getRegexMatchWhole(Patterns.OXML_SCHEMA_URI_NAMESPACE_PATTERN);
    class OXMLName extends String {
        constructor(value) {
            if (value === null)
                return null;
            if (!OXMLName.valueIsValid(value))
                throw new SyntaxError("Invalid OXML name.");
            super(value);
        }
        static valueIsValid(value) {
            return OXML_NAME_REGEX.test(String(value));
        }
    }
    Markup.OXMLName = OXMLName;
    let OXMLSchemaURIType;
    (function (OXMLSchemaURIType) {
        OXMLSchemaURIType[OXMLSchemaURIType["URL"] = 0] = "URL";
        OXMLSchemaURIType[OXMLSchemaURIType["Namespace"] = 1] = "Namespace";
    })(OXMLSchemaURIType = Markup.OXMLSchemaURIType || (Markup.OXMLSchemaURIType = {}));
    let OXMLSchemaURISymbols;
    (function (OXMLSchemaURISymbols) {
        OXMLSchemaURISymbols.type = Symbol("type");
    })(OXMLSchemaURISymbols || (OXMLSchemaURISymbols = {}));
    class OXMLSchemaURI extends String {
        constructor(value) {
            if (!OXMLSchemaURI.valueIsValid(value))
                throw new SyntaxError("Invalid OXML schema URI.");
            super(value);
            this[OXMLSchemaURISymbols.type] = OXMLSchemaURI.getSchemaURIType(value);
        }
        static getSchemaURIType(value) {
            let valueStr = String(value);
            if (OXML_SCHEMA_URI_URL_REGEX.test(String(value)))
                return OXMLSchemaURIType.URL;
            else if (OXML_SCHEMA_URI_NAMESPACE_REGEX.test(String(value)))
                return OXMLSchemaURIType.Namespace;
            return null;
        }
        get type() {
            return this[OXMLSchemaURISymbols.type];
        }
        static valueIsValid(value) {
            return this.getSchemaURIType(value) !== null;
        }
    }
    Markup.OXMLSchemaURI = OXMLSchemaURI;
    let OXMLSchemaInfoSymbols;
    (function (OXMLSchemaInfoSymbols) {
        OXMLSchemaInfoSymbols.prefix = Symbol("name");
        OXMLSchemaInfoSymbols.uri = Symbol("uri");
    })(OXMLSchemaInfoSymbols = Markup.OXMLSchemaInfoSymbols || (Markup.OXMLSchemaInfoSymbols = {}));
    class OXMLSchemaInfo {
        constructor(prefix, uri) {
            this[OXMLSchemaInfoSymbols.prefix] = prefix;
            this[OXMLSchemaInfoSymbols.uri] = uri;
        }
        get prefix() {
            return this[OXMLSchemaInfoSymbols.prefix];
        }
        get uri() {
            return this[OXMLSchemaInfoSymbols.uri];
        }
    }
    Markup.OXMLSchemaInfo = OXMLSchemaInfo;
    let ObjectSymbols;
    (function (ObjectSymbols) {
        ObjectSymbols.name = Symbol("name");
        ObjectSymbols.prefix = Symbol("prefix");
        ObjectSymbols.members = Symbol("members");
        ObjectSymbols.schemas = Symbol("schemas");
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
        get schemas() {
            return this[ObjectSymbols.schemas];
        }
    }
    Markup.Object = Object;
    let MemberSymbols;
    (function (MemberSymbols) {
        MemberSymbols.name = Symbol("name");
        MemberSymbols.value = Symbol("value");
    })(MemberSymbols || (MemberSymbols = {}));
    class Member {
        constructor(name, value) {
            this[MemberSymbols.name] = name;
            this[MemberSymbols.value] = value;
        }
        get name() {
            return this[MemberSymbols.name];
        }
        get value() {
            return this[MemberSymbols.value];
        }
    }
    Markup.Member = Member;
})(Markup || (Markup = {}));
//# sourceMappingURL=markup.js.map