/*THIS IS AN STAND-ALONE SCRIPT, AND SHALL NOT REFERENCE ANY EXTERNAL SCRIPTS.*/
var Core;
(function (Core) {
    var DependencySystem;
    (function (DependencySystem) {
        class Identifier extends Array {
            constructor(arg0) {
                if (typeof arg0 === "string") {
                    let members = Identifier.getMembersFromString(arg0); //Get individual members
                    super(...members);
                }
                else if (arg0 instanceof Array) {
                    super(...arg0);
                }
                else
                    throw new ReferenceError(`Invalid value for argument "arg0". ${arg0} is not a valid string or Array.`);
            }
            static get MEMBER_VALIDATION_PATTERN() { return /^[a-zA-Z]\w*?$/; }
            static *getCommonMembers(identifier1, identifier2) {
                for (let i = 0; i < identifier1.length && i < identifier2.length; i++) {
                    let member1 = identifier1[i];
                    let member2 = identifier2[i];
                    if (member1 === member2)
                        yield member1;
                    else
                        break;
                }
            }
            static getCommonIdentifier(identifier1, identifier2) {
                let commonMembers = Array.from(this.getCommonMembers(identifier1, identifier2));
                return new Identifier(commonMembers);
            }
            static validateMember(member) {
                if (typeof member != "string")
                    throw new ReferenceError(`${member} is not a valid string.`);
                return this.MEMBER_VALIDATION_PATTERN.test(member);
            }
            static validateMultiple(members) {
                for (let member of members)
                    if (!this.validateMember(member))
                        return false;
                return true;
            }
            static getMembersFromString(identifierStr) {
                let members = identifierStr.split(".");
                if (!Identifier.validateMultiple(members))
                    throw new Error("Cannot push requested members. All of the provided items must be valid.");
                return members;
            }
            toString() {
                return this.join(".");
            }
            push(...items) {
                //Validate items
                if (Identifier.validateMultiple(items))
                    throw new Error("Cannot push requested members. All of the provided items must be valid.");
                return super.push(...items);
            }
            splice(start, deleteCount, ...items) {
                //Validate items
                if (Identifier.validateMultiple(items))
                    throw new Error("Cannot splice/insert the requested members. All of the provided items must be valid.");
                return super.splice(start, deleteCount, ...items);
            }
            fill(value, start, end) {
                if (!Identifier.validateMember(value))
                    throw new Error("Cannot fill. The provided member is invalid.");
                return super.fill(value, start, end);
            }
            concat(identifier) {
                return new Identifier([...this, ...identifier]);
            }
        }
        DependencySystem.Identifier = Identifier;
        const promiseKey = Symbol("promise");
        class Resolver {
            constructor(name) {
                this.isResolved = false;
                this.identifier = new Identifier(name);
                let self = this;
                function handler(resolve, reject) {
                    self.resolve = function (value) {
                        resolve(value);
                        self.isResolved = true;
                    };
                }
                this[promiseKey] = new Promise(handler);
            }
            get promise() {
                return this[promiseKey];
            }
        }
        DependencySystem.Resolver = Resolver;
        DependencySystem.resolvers = [];
        /**
         * Represents a placeholder for a module that is required.
         */
        class ModuleRequest {
            constructor(name) {
                this.identifier = new Identifier(name);
            }
            resolve() {
                let resolvedVal = null;
                return resolvedVal || {};
            }
        }
        DependencySystem.ModuleRequest = ModuleRequest;
        class ModuleRecursionList extends Array {
            get current() {
                return this.slice(-1)[0] || null;
            }
            descend(module) {
                let previous = this.current;
                this.push(module);
                return previous;
            }
            ascend() {
                return this.pop();
            }
        }
        DependencySystem.ModuleRecursionList = ModuleRecursionList;
        class ModuleConstructionContextHandler {
            constructor(targetModule) {
                this.targetModule = targetModule;
            }
            defineProperty(target, propertyKey, attributes) {
                declareModuleMember(this.targetModule, String(propertyKey), attributes.value);
                return Reflect.set(target, propertyKey, attributes);
            }
        }
        DependencySystem.ModuleConstructionContextHandler = ModuleConstructionContextHandler;
        /**
         * Represents a declaration.
         */
        class Declaration {
            constructor(name) {
                this.identifier = new Identifier(name);
            }
            get absoluteIdentifier() {
                return this.parentModule ? this.parentModule.absoluteIdentifier.concat(this.identifier) : this.identifier;
            }
        }
        DependencySystem.Declaration = Declaration;
        /**
         * Represents a module declaration.
         */
        class ModuleDeclaration extends Declaration {
            constructor(name, requires, constructor) {
                super(name);
                this.requires = requires;
                this.moduleConstructor = constructor;
            }
            async construct() {
                this.value = {}; //Initialize empty module
                let resolvedDependencies = this.requires.map(dr => dr.resolve()); //Resolve dependencies
                let constructionContext = new Proxy(this.value, new ModuleConstructionContextHandler(this)); //Create context
                //Construct module using the provided constructor
                await this.moduleConstructor.call(constructionContext, resolvedDependencies);
            }
        }
        DependencySystem.ModuleDeclaration = ModuleDeclaration;
        /**
         * Represents a module member declaration
         */
        class ModuleMemberDeclaration extends Declaration {
            constructor(parentModule, name) {
                super(name);
                this.parentModule = parentModule;
            }
        }
        DependencySystem.ModuleMemberDeclaration = ModuleMemberDeclaration;
        DependencySystem.declarations = [];
        function resolveName(name) {
            let resolver = new Resolver(name);
            DependencySystem.resolvers.push(resolver);
            return resolver.promise;
        }
        DependencySystem.resolveName = resolveName;
        function declareModuleMember(parentModule, name, value) {
            let declaration = new ModuleMemberDeclaration(parentModule, name); //Declare module member
            //Add declaration
            DependencySystem.declarations.push(declaration);
        }
        DependencySystem.declareModuleMember = declareModuleMember;
        function declareModule(name, requires, constructor) {
            let declaration = new ModuleDeclaration(name, requires, constructor); //Create module declaration
            //Add to declarations
            DependencySystem.declarations.push(declaration);
            //Construct module and return
            return declaration.construct();
        }
        DependencySystem.declareModule = declareModule;
        function requireModule(name) {
            let request = new ModuleRequest(name); //Create module request
            return request;
        }
        DependencySystem.requireModule = requireModule;
    })(DependencySystem = Core.DependencySystem || (Core.DependencySystem = {}));
})(Core || (Core = {}));
var $;
(function ($) {
    $.resolve = {
        name: Core.DependencySystem.resolveName
    };
    $.declare = {
        module: Core.DependencySystem.declareModule
    };
    $.require = {
        module: Core.DependencySystem.requireModule
    };
})($ || ($ = {}));
//# sourceMappingURL=Core.DependencySystem.js.map