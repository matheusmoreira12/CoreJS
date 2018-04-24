namespace Markup {
    namespace Patterns {
        function concatPatterns(...patterns: string[]): string {
            return patterns.join("");
        }

        function combinePatterns(...patterns: string[]): string {
            return patterns.join("|");
        }

        export const OXML_NAME_PATTERN = "[a-zA-Z$_]\\w*";
        export const OXML_SCHEMA_PREFIX_PATTERN = "(-?[a-zA-Z_]\w*)*?";
        export const OXML_SCHEMA_URI_URL_PATTERN = "([a-z][a-z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\\3)@)?(?=(\\[[0-9A-F:.]{2,}\\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\10)?)(?:\\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\12)?";
        export const OXML_SCHEMA_URI_NAMESPACE_PATTERN = "clr-namespace;\s*?(?<namespace>(.?[a-zA-Z_]\\w*)+)";
        export const OXML_SCHEMA_URI_PATTERN = combinePatterns(OXML_SCHEMA_URI_NAMESPACE_PATTERN,
            OXML_SCHEMA_URI_URL_PATTERN);

        // Returns a regex created from the specified pattern that only matches the whole string.
        export function getRegexFromPatternMatchWhole(pattern: string): RegExp {
            return new RegExp(`^${pattern}$`);
        }
    }

    const OXML_NAME_REGEX = Patterns.getRegexFromPatternMatchWhole(Patterns.OXML_NAME_PATTERN);
    const OXML_SCHEMA_URI_REGEX = Patterns.getRegexFromPatternMatchWhole(Patterns.OXML_SCHEMA_URI_PATTERN);
    const OXML_SCHEMA_PREFIX_REGEX = Patterns.getRegexFromPatternMatchWhole(Patterns.OXML_SCHEMA_PREFIX_PATTERN);

    export class OxmlSchemaPrefix extends String {
        public static valueIsValid(value: any): boolean {
            return OXML_SCHEMA_PREFIX_REGEX.test(String(value));
        }

        public constructor(value: any) {
            if (!OxmlSchemaPrefix.valueIsValid(value))
                throw new SyntaxError("Invalid OXML schema prefix.");

            super(value);
        }
    }

    export class OxmlSchemaURI extends String {
        public static valueIsValid(value: any): boolean {
            return OXML_SCHEMA_URI_REGEX.test(String(value));
        }

        public constructor(value: any) {
            if (!OxmlSchemaURI.valueIsValid(value))
                throw new SyntaxError("Invalid OXML schema URI.");

            super(value);
        }
    }

    export namespace OxmlSchemaInfoSymbols {
        export const prefix = Symbol("name");
        export const uri = Symbol("uri");
    }

    export class OxmlSchemaInfo {
        constructor(prefix: string, uri: OxmlSchemaURI) {
            this[OxmlSchemaInfoSymbols.prefix] = name;
            this[OxmlSchemaInfoSymbols.uri] = uri;
        }

        public get name(): string {
            return this[OxmlSchemaInfoSymbols.prefix];
        }

        public get uri(): OxmlSchemaURI {
            return this[OxmlSchemaInfoSymbols.uri];
        }
    }

    export class OxmlName extends String {
        public static valueIsValid(value: any): boolean {
            return OXML_NAME_REGEX.test(String(value));
        }

        public constructor(value: any) {
            if (value === null)
                return null;

            if (!OxmlName.valueIsValid(value))
                throw new SyntaxError("Invalid OXML name.");

            super(value);
        }
    }

    namespace ObjectSymbols {
        export const name = Symbol("name");
        export const prefix = Symbol("prefix");
        export const members = Symbol("members");
    }

    export class Object {
        public constructor(name: OxmlName, prefix: OxmlName) {
            this[ObjectSymbols.name] = name;
            this[ObjectSymbols.prefix] = prefix;
            this[ObjectSymbols.members] = [];
        }

        public get name(): OxmlName {
            return this[ObjectSymbols.name];
        }

        public get prefix(): OxmlName {
            return this[ObjectSymbols.prefix];
        }

        public get members(): Member[] {
            return this[ObjectSymbols.members];
        }
    }

    namespace MemberSymbols {
        export const name = Symbol("name");
        export const target = Symbol("target");
    }

    export class Member {
        public constructor(name: OxmlName, target: OxmlName) {
            this[MemberSymbols.name] = name;
            this[MemberSymbols.target] = target;
        }

        public get name(): OxmlName {
            return this[MemberSymbols.name];
        }
        public get for(): OxmlName {
            return this[MemberSymbols.target];
        }
    }
}