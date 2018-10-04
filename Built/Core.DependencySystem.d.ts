declare namespace Core.DependencySystem {
    class Identifier extends Array<string> {
        static readonly MEMBER_VALIDATION_PATTERN: RegExp;
        static getCommonMembers(identifier1: Identifier, identifier2: Identifier): IterableIterator<string>;
        static getCommonIdentifier(identifier1: Identifier, identifier2: Identifier): Identifier;
        static validateMember(member: string): boolean;
        static validateMultiple(members: string[]): boolean;
        static getMembersFromString(identifierStr: string): string[];
        constructor(members: string[]);
        constructor(identifierStr: string);
        toString(): string;
        push(...items: string[]): number;
        splice(start: number, deleteCount: number, ...items: string[]): string[];
        fill(value: string, start?: number, end?: number): this;
        concat(identifier: Identifier): Identifier;
    }
    class Resolver<TValue> {
        constructor(name: string);
        readonly promise: Promise<TValue>;
        resolve: (value: TValue) => void;
        identifier: Identifier;
        isResolved: boolean;
    }
    let resolvers: Resolver<any>[];
    /**
     * Represents a placeholder for a module that is required.
     */
    class ModuleRequest {
        constructor(name: string);
        resolve(): object;
        identifier: Identifier;
    }
    class ModuleRecursionList extends Array<ModuleDeclaration> {
        readonly current: ModuleDeclaration;
        descend(module: ModuleDeclaration): ModuleDeclaration;
        ascend(): ModuleDeclaration;
    }
    type ModuleConstructor = (this: ProxyConstructor, ...dependencies: object[]) => void;
    class ModuleConstructionContextHandler implements ProxyHandler<object> {
        constructor(targetModule: ModuleDeclaration);
        defineProperty(target: object, propertyKey: PropertyKey, attributes: PropertyDescriptor): boolean;
        targetModule: ModuleDeclaration;
    }
    /**
     * Represents a declaration.
     */
    abstract class Declaration {
        constructor(name: string);
        readonly absoluteIdentifier: Identifier;
        identifier: Identifier;
        parentModule: ModuleDeclaration;
        recursion: ModuleRecursionList;
    }
    /**
     * Represents a module declaration.
     */
    class ModuleDeclaration extends Declaration {
        constructor(name: string, requires: ModuleRequest[], constructor: ModuleConstructor);
        construct(): Promise<void>;
        requires: ModuleRequest[];
        moduleConstructor: ModuleConstructor;
        value: object;
    }
    /**
     * Represents a module member declaration
     */
    class ModuleMemberDeclaration<TMember> extends Declaration {
        constructor(parentModule: ModuleDeclaration, name: string);
    }
    let declarations: Declaration[];
    function resolveName<T>(name: string): Promise<T>;
    function declareModuleMember<TValue>(parentModule: ModuleDeclaration, name: string, value: TValue): void;
    function declareModule(name: string, requires: ModuleRequest[], constructor: ModuleConstructor): Promise<void>;
    function requireModule(name: string): ModuleRequest;
}
declare namespace $ {
    let resolve: {
        name: <T>(name: string) => Promise<T>;
    };
    let declare: {
        module: (name: string, requires: Core.DependencySystem.ModuleRequest[], constructor: Core.DependencySystem.ModuleConstructor) => Promise<void>;
    };
    let require: {
        module: (name: string) => Core.DependencySystem.ModuleRequest;
    };
}
