namespace Markup {
    namespace Patterns {
        const OXML_NAME_MEMBER_PATTERN = "[a-zA-Z_]\\w*";
        export const OXML_NAME_PATTERN = `(${OXML_NAME_MEMBER_PATTERN})(.${OXML_NAME_MEMBER_PATTERN})*`;

        export const OXML_SCHEMA_URI_URL_PATTERN = "([a-z][a-z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\\3)@)?(?=(\\[[0-9A-F:.]{2,}\\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\10)?)(?:\\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\12)?";
        export const OXML_SCHEMA_URI_NAMESPACE_PATTERN = "clr-namespace;\s*?(.?[a-zA-Z_]\\w*)+";

        // Returns a regex created from the specified pattern that only matches the whole string.
        export function getRegexMatchWhole(pattern: string): RegExp {
            return new RegExp(`^${pattern}$`);
        }
    }

    const OXML_NAME_REGEX = Patterns.getRegexMatchWhole(Patterns.OXML_NAME_PATTERN);
    const OXML_SCHEMA_URI_URL_REGEX = Patterns.getRegexMatchWhole(Patterns.OXML_SCHEMA_URI_URL_PATTERN);
    const OXML_SCHEMA_URI_NAMESPACE_REGEX = Patterns.getRegexMatchWhole(Patterns.OXML_SCHEMA_URI_NAMESPACE_PATTERN);

    export class OXMLName extends String {
        public static valueIsValid(value: any): boolean {
            return OXML_NAME_REGEX.test(String(value));
        }

        public constructor(value: any) {
            if (value === null)
                return null;

            if (!OXMLName.valueIsValid(value))
                throw new SyntaxError("Invalid OXML name.");

            super(value);
        }
    }

    export enum OXMLSchemaURIType { URL, Namespace }

    namespace OXMLSchemaURISymbols {
        export const type = Symbol("type");
    }

    export class OXMLSchemaURI extends String {
        public static getSchemaURIType(value: any): OXMLSchemaURIType {
            let valueStr = String(value);

            if (OXML_SCHEMA_URI_URL_REGEX.test(String(value)))
                return OXMLSchemaURIType.URL;
            else if (OXML_SCHEMA_URI_NAMESPACE_REGEX.test(String(value)))
                return OXMLSchemaURIType.Namespace;

            return null;
        }

        public get type(): OXMLSchemaURIType {
            return this[OXMLSchemaURISymbols.type];
        }

        public static valueIsValid(value: any): boolean {
            return this.getSchemaURIType(value) !== null;
        }

        public constructor(value: any) {
            if (!OXMLSchemaURI.valueIsValid(value))
                throw new SyntaxError("Invalid OXML schema URI.");

            super(value);

            this[OXMLSchemaURISymbols.type] = OXMLSchemaURI.getSchemaURIType(value);
        }
    }

    export namespace OXMLSchemaInfoSymbols {
        export const prefix = Symbol("name");
        export const uri = Symbol("uri");
    }

    export class OXMLSchemaInfo {
        constructor(prefix: OXMLName, uri: OXMLSchemaURI) {
            this[OXMLSchemaInfoSymbols.prefix] = prefix;
            this[OXMLSchemaInfoSymbols.uri] = uri;
        }

        public get prefix(): OXMLName {
            return this[OXMLSchemaInfoSymbols.prefix];
        }

        public get uri(): OXMLSchemaURI {
            return this[OXMLSchemaInfoSymbols.uri];
        }
    }

    namespace ObjectSymbols {
        export const name = Symbol("name");
        export const prefix = Symbol("prefix");
        export const members = Symbol("members");
        export const schemas = Symbol("schemas");
    }

    export class Object {
        public constructor(name: OXMLName, prefix: OXMLName) {
            this[ObjectSymbols.name] = name;
            this[ObjectSymbols.prefix] = prefix;
            this[ObjectSymbols.members] = [];
        }

        public get name(): OXMLName {
            return this[ObjectSymbols.name];
        }

        public get prefix(): OXMLName {
            return this[ObjectSymbols.prefix];
        }

        public get members(): Member[] {
            return this[ObjectSymbols.members];
        }

        public get schemas(): OXMLSchemaInfo[] {
            return this[ObjectSymbols.schemas];
        }
    }

    namespace MemberSymbols {
        export const name = Symbol("name");
        export const value = Symbol("value");
    }

    export type OXMLMemberValue = string | Object;

    export class Member {
        public constructor(name: OXMLName, value: OXMLMemberValue) {
            this[MemberSymbols.name] = name;
            this[MemberSymbols.value] = value;
        }

        public get name(): OXMLName {
            return this[MemberSymbols.name];
        }
        public get value(): OXMLMemberValue {
            return this[MemberSymbols.value];
        }
    }
}