declare namespace Markup {
    class OXMLName extends String {
        static valueIsValid(value: any): boolean;
        constructor(value: any);
    }
    enum OXMLSchemaURIType {
        URL = 0,
        Namespace = 1,
    }
    class OXMLSchemaURI extends String {
        static getSchemaURIType(value: any): OXMLSchemaURIType;
        readonly type: OXMLSchemaURIType;
        static valueIsValid(value: any): boolean;
        constructor(value: any);
    }
    namespace OXMLSchemaInfoSymbols {
        const prefix: unique symbol;
        const uri: unique symbol;
    }
    class OXMLSchemaInfo {
        constructor(prefix: OXMLName, uri: OXMLSchemaURI);
        readonly prefix: OXMLName;
        readonly uri: OXMLSchemaURI;
    }
    class Object {
        constructor(name: OXMLName, prefix: OXMLName);
        readonly name: OXMLName;
        readonly prefix: OXMLName;
        readonly members: Member[];
        readonly schemas: OXMLSchemaInfo[];
    }
    type OXMLMemberValue = string | Object;
    class Member {
        constructor(name: OXMLName, value: OXMLMemberValue);
        readonly name: OXMLName;
        readonly value: OXMLMemberValue;
    }
}
