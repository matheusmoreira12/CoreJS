declare namespace Markup {
    class OxmlSchemaPrefix extends String {
        static valueIsValid(value: any): boolean;
        constructor(value: any);
    }
    class OxmlSchemaURI extends String {
        static valueIsValid(value: any): boolean;
        constructor(value: any);
    }
    namespace OxmlSchemaInfoSymbols {
        const prefix: unique symbol;
        const uri: unique symbol;
    }
    class OxmlSchemaInfo {
        constructor(prefix: string, uri: OxmlSchemaURI);
        readonly name: string;
        readonly uri: OxmlSchemaURI;
    }
    class OxmlName extends String {
        static valueIsValid(value: any): boolean;
        constructor(value: any);
    }
    class Object {
        constructor(name: OxmlName, prefix: OxmlName);
        readonly name: OxmlName;
        readonly prefix: OxmlName;
        readonly members: Member[];
    }
    class Member {
        constructor(name: OxmlName, target: OxmlName);
        readonly name: OxmlName;
        readonly for: OxmlName;
    }
}
