var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        class SimpleList extends Array {
            constructor(...items) {
                super(...items);
            }
            remove(item) {
                let index = this.indexOf(item);
                if (index == -1)
                    throw new Error("Cannot remove item. Item not found.");
                this.splice(index, 1);
            }
        }
        Collections.SimpleList = SimpleList;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="Collections.SimpleList.ts"/>
var Core;
(function (Core) {
    const thisArgKey = Symbol("thisArg");
    const attachedGroupsKey = Symbol("attachedGroups");
    const attachedMethodsKey = Symbol("attachedMethods");
    const isPropagationStoppedKey = Symbol("isPropagationStopped");
    class MethodGroup {
        constructor(thisArg) {
            this[thisArgKey] = thisArg;
            this[attachedGroupsKey] = new Core.Collections.SimpleList();
            this[attachedMethodsKey] = new Core.Collections.SimpleList();
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = false;
        }
        attach(method) {
            if (method instanceof MethodGroup)
                this.attachedGroups.push(method);
            else if (method instanceof Function)
                this.attachedMethods.push(method);
            else
                throw new Error("Invalid value for parameter \"method\". A Function or a MethodGroup was expected.");
        }
        detach(method) {
            if (method instanceof MethodGroup)
                this.attachedGroups.remove(method);
            else if (method instanceof Function)
                this.attachedMethods.remove(method);
            else
                throw new Error("Invalid value for parameter \"method\". A Function or a MethodGroup was expected.");
        }
        invoke(...args) {
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = false;
            for (let method of this.attachedMethods)
                method.call(this.thisArg, ...args);
            for (let group of this.attachedGroups)
                group.invoke(...args);
        }
        stopPropagation() {
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = true;
        }
        get thisArg() { return this[thisArgKey]; }
        get attachedGroups() { return this[attachedGroupsKey]; }
        get attachedMethods() { return this[attachedMethodsKey]; }
        get isPropagationStopped() { return this[isPropagationStoppedKey]; }
    }
    Core.MethodGroup = MethodGroup;
})(Core || (Core = {}));
///<reference path="MethodGroup.ts"/>
var Core;
(function (Core) {
    class Event extends Core.MethodGroup {
        constructor(thisArg, defaultListener) {
            super(thisArg);
            if (defaultListener)
                this.attach(defaultListener);
        }
        attach(listener) {
            super.attach(listener);
        }
        detach(listener) {
            super.detach(listener);
        }
        watch(node, domEvtName, argTrans = (...args) => args) {
        }
        unwatch(node, domEvtName) {
        }
        invoke(sender, e) {
            super.invoke(sender, e);
        }
    }
    Core.Event = Event;
})(Core || (Core = {}));
///<reference path="Events.ts"/>
///<reference path="Collections.SimpleList.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        let ListChangeMode;
        (function (ListChangeMode) {
            ListChangeMode[ListChangeMode["Added"] = 1] = "Added";
            ListChangeMode[ListChangeMode["Removed"] = 2] = "Removed";
        })(ListChangeMode = Collections.ListChangeMode || (Collections.ListChangeMode = {}));
        class ListChangedEvent extends Core.Event {
            constructor(thisArg, defaultListener) {
                super(thisArg, defaultListener);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.attach(listener);
            }
            invoke(sender, e) {
                super.invoke(sender, e);
            }
        }
        Collections.ListChangedEvent = ListChangedEvent;
        function notifyListChange(list, itemsWereRemoved, itemsWereAdded, oldIndex, oldItems, newIndex, newItems) {
            list.invokeOnListChanged({
                mode: (itemsWereRemoved ? ListChangeMode.Removed : 0) |
                    (itemsWereAdded ? ListChangeMode.Added : 0),
                oldIndex: itemsWereRemoved ? oldIndex : null,
                oldItems: itemsWereRemoved ? oldItems : null,
                newIndex: itemsWereAdded ? newIndex : null,
                newItems: itemsWereAdded ? newItems : null
            });
        }
        class List extends Collections.SimpleList {
            constructor(...items) {
                super(...items);
                this.listChangedEvent = new ListChangedEvent(this, this._onListChanged);
            }
            push(...items) {
                let length = super.push(...items);
                notifyListChange(this, false, true, null, null, length - 1, items);
                return length;
            }
            splice(start, deleteCount, ...items) {
                let oldItems = super.splice(start, deleteCount, ...items);
                let itemsWereRemoved = deleteCount > 0;
                let itemsWereAdded = items.length > 0;
                notifyListChange(this, itemsWereRemoved, itemsWereAdded, null, null, length - 1, items);
                return oldItems;
            }
            _onListChanged(sender, e) { }
            invokeOnListChanged(e) {
                if (this.listChangedEvent)
                    this.listChangedEvent.invoke(this, e);
            }
        }
        Collections.List = List;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="Collections.List.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        let parentTreeItemKey = Symbol("parentTreeItem");
        function setParent(item, parent) {
            item.items.listChangedEvent.attach(parent.items.listChangedEvent);
            item[parentKey] = parent;
        }
        function unsetParent(item) {
            item.items.listChangedEvent.detach(item.parent.items.listChangedEvent);
            item[parentKey] = null;
        }
        class TreeItemList extends Collections.List {
            constructor(parentTreeItem, ...items) {
                super(...items);
                this[parentTreeItemKey] = parentTreeItem;
            }
            _onListChanged(sender, e) {
                super._onListChanged(sender, e);
                if (e.mode & Collections.ListChangeMode.Added)
                    for (let item of e.newItems)
                        setParent(item, this.parentTreeItem);
                if (e.mode & Collections.ListChangeMode.Removed)
                    for (let item of e.oldItems)
                        unsetParent(item);
            }
            get parentTreeItem() { return this[parentTreeItemKey]; }
        }
        Collections.TreeItemList = TreeItemList;
        let parentKey = Symbol("parent");
        let itemsKey = Symbol("items");
        class TreeItem {
            constructor(...items) {
                this[itemsKey] = new TreeItemList(this, ...items);
                this[parentKey] = null;
            }
            *listItemsWithRecursion() {
                yield* this.items;
                for (let item of this.items)
                    yield* item.items;
            }
            get items() { return this[itemsKey]; }
            get parent() { return this[parentKey]; }
        }
        Collections.TreeItem = TreeItem;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="../../Base/Sources/Collections.TreeItem.ts"/>
///<reference path="../../Base/Sources/Collections.List.ts"/>
var Core;
(function (Core) {
    var ModuleSystem;
    (function (ModuleSystem) {
        /**
         * Represents a declaration.
         * Contains all the required information for a declaration, like an identifier, a parent module and a module recursion
         * list.
         */
        class Declaration extends Core.Collections.TreeItem {
            constructor(name, ...items) {
                super(...items);
                this.identifier = new ModuleSystem.Identifier(name);
            }
            delete() {
                if (this.parent !== null)
                    this.parent.items.remove(this);
            }
            get absoluteIdentifier() {
                return this.parent ? this.parent.absoluteIdentifier.concat(this.identifier)
                    : this.identifier;
            }
            get name() { return this.identifier.toString(); }
            get absoluteName() { return this.absoluteIdentifier.toString(); }
            getValue() { return; }
        }
        ModuleSystem.Declaration = Declaration;
        const resolvedDependenciesKey = Symbol("resolvedDependencies");
        const dataStorageIdKey = Symbol("dataStorageId");
        /**
         * Represents a module declaration.
         */
        class ModuleDeclaration extends Declaration {
            constructor(name, dependencies, constructor) {
                super(name);
                this.dependencies = dependencies;
                this.moduleConstructor = constructor;
                this[resolvedDependenciesKey] = null;
                this._intializeDataStorage();
            }
            _intializeDataStorage() { this[dataStorageIdKey] = ModuleSystem.DeclarationStorage.storeData({}); }
            async *_resolveDependencies() {
                for (let dependency of this.dependencies)
                    yield await dependency.promise;
            }
            async construct() {
                let value = this.getValue();
                let resolvedDependencies = []; //Empty resolved dependencies
                //Resolve dependencies
                for await (let dependency of this._resolveDependencies())
                    resolvedDependencies.push(dependency);
                let constructionContext = new Proxy(value, new ModuleSystem.ModuleConstructionContextHandler(this)); //Create context
                let dependencyValues = resolvedDependencies.map(d => d.getValue()); //Get resolved dependency values
                //Construct module using the provided constructor
                await this.moduleConstructor.call(constructionContext, dependencyValues);
            }
            get resolvedDependencies() { return this[resolvedDependenciesKey]; }
            getValue() { return ModuleSystem.DeclarationStorage.retrieveData(this[dataStorageIdKey]); }
        }
        ModuleSystem.ModuleDeclaration = ModuleDeclaration;
        /**
         * Represents a module member declaration
         */
        class ModuleMemberDeclaration extends Declaration {
            constructor(name) {
                super(name);
            }
            getValue() {
                let parentValue = this.parent.getValue();
                return parentValue[this.name];
            }
        }
        ModuleSystem.ModuleMemberDeclaration = ModuleMemberDeclaration;
        class DeclarationList extends Core.Collections.List {
            _onListChanged(sender, e) {
                super._onListChanged(sender, e);
                if (e.mode & Core.Collections.ListChangeMode.Added)
                    for (let declaration of e.newItems)
                        declaration.items.listChangedEvent.attach(this.listChangedEvent);
                if (e.mode & Core.Collections.ListChangeMode.Removed)
                    for (let declaration of e.oldItems)
                        declaration.items.listChangedEvent.detach(this.listChangedEvent);
            }
            containsName(name) { return this.findIndex(i => i.name == name) > -1; }
            getByAbsoluteName(absoluteName) {
                let recursiveItems = Array.from(this.listItemsWithRecursion());
                return recursiveItems.find(d => d.absoluteName == absoluteName);
            }
            *listItemsWithRecursion() {
                yield* this;
                for (let item of this)
                    yield* item.listItemsWithRecursion();
            }
        }
        ModuleSystem.DeclarationList = DeclarationList;
    })(ModuleSystem = Core.ModuleSystem || (Core.ModuleSystem = {}));
})(Core || (Core = {}));
///<reference path="Events.ts"/>
///<reference path="Collections.List.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        class KeyValuePair {
            constructor(key, value) {
                this.key = key;
                this.value = value;
            }
        }
        Collections.KeyValuePair = KeyValuePair;
        class Dictionary extends Collections.List {
            indexOfKey(key) { return this.findIndex(i => Object.is(i.key, key)); }
            containsKey(key) { return this.indexOfKey(key) > -1; }
            getValue(key) {
                let index = this.indexOfKey(key);
                if (index == -1)
                    return undefined;
                return this[index].value;
            }
            setValue(key, value) {
                let index = this.findIndex(i => i.key == key);
                if (index > -1)
                    this[index].value = value;
                else
                    this.push(new KeyValuePair(key, value));
            }
        }
        Collections.Dictionary = Dictionary;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="../../Base/Sources/Collections.Dictionary.ts"/>
var Core;
(function (Core) {
    var ModuleSystem;
    (function (ModuleSystem) {
        var DeclarationStorage;
        (function (DeclarationStorage) {
            let storedData = new Core.Collections.Dictionary();
            function getNewId() {
                let id = 0;
                while (storedData.containsKey(id))
                    id++;
                return id;
            }
            function storeData(initial = {}) {
                let id = getNewId();
                storedData.setValue(id, initial);
                return id;
            }
            DeclarationStorage.storeData = storeData;
            function retrieveData(id) {
                if (!storedData.containsKey(id))
                    throw new Error("Invalid declaration storage entry ID.");
                return storedData.getValue(id);
            }
            DeclarationStorage.retrieveData = retrieveData;
        })(DeclarationStorage = ModuleSystem.DeclarationStorage || (ModuleSystem.DeclarationStorage = {}));
    })(ModuleSystem = Core.ModuleSystem || (Core.ModuleSystem = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ModuleSystem;
    (function (ModuleSystem) {
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
                    if (member1 !== member2)
                        break;
                    yield member1;
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
                    throw new Error("Cannot push requested members. All items must be valid.");
                return members;
            }
            toString() {
                return this.join(".");
            }
            push(...items) {
                //Validate items
                if (Identifier.validateMultiple(items))
                    throw new Error("Cannot push requested members. All items must be valid.");
                return super.push(...items);
            }
            splice(start, deleteCount, ...items) {
                //Validate items
                if (Identifier.validateMultiple(items))
                    throw new Error("Cannot insert the requested members. All items must be valid.");
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
        ModuleSystem.Identifier = Identifier;
    })(ModuleSystem = Core.ModuleSystem || (Core.ModuleSystem = {}));
})(Core || (Core = {}));
///<reference path="../../Base/Sources/Promises.ts"/>
var Core;
(function (Core) {
    var ModuleSystem;
    (function (ModuleSystem) {
        let ResolverType;
        (function (ResolverType) {
            ResolverType[ResolverType["NotSpecified"] = 0] = "NotSpecified";
            ResolverType[ResolverType["ModuleResolver"] = 1] = "ModuleResolver";
            ResolverType[ResolverType["ModuleMemberResolver"] = 2] = "ModuleMemberResolver";
        })(ResolverType = ModuleSystem.ResolverType || (ModuleSystem.ResolverType = {}));
        const promiseKey = Symbol("promise");
        const isResolvedKey = Symbol("isResolved");
        const resolveKey = Symbol("resolve");
        const typeKey = Symbol("type");
        class Resolver {
            constructor(name, type = ResolverType.NotSpecified) {
                this.identifier = new ModuleSystem.Identifier(name);
                this[typeKey] = type;
                let self = this;
                function handler(resolve, reject) {
                    self[resolveKey] = resolve;
                }
                //Create resolver promise
                this[promiseKey] = new Promise(handler);
                //Set isResolved flag
                this[isResolvedKey] = false;
            }
            resolve(value) {
                if (this.isResolved)
                    throw new Error("Cannot resolve. Resolver already resolved.");
                //Call promise resolve
                this[resolveKey](value);
                //Set isResolved flag
                this[isResolvedKey] = true;
            }
            get promise() { return this[promiseKey]; }
            get isResolved() { return this[isResolvedKey]; }
            ;
            get type() { return this[typeKey]; }
            get name() { return this.identifier.toString(); }
        }
        ModuleSystem.Resolver = Resolver;
        class ResolverList extends Core.Collections.List {
            resolveEvery(predicate, value) {
                for (let resolver of this)
                    if (predicate(resolver))
                        resolver.resolve(value);
            }
        }
        ModuleSystem.ResolverList = ResolverList;
    })(ModuleSystem = Core.ModuleSystem || (Core.ModuleSystem = {}));
})(Core || (Core = {}));
///<reference path="../../Base/Sources/Collections.Dictionary.ts"/>
///<reference path="../../Base/Sources/Collections.List.ts"/>
///<reference path="../../Base/Sources/Promises.ts"/>
///<reference path="Resolver.ts"/>
///<reference path="Declaration.ts"/>
var Core;
(function (Core) {
    var ModuleSystem;
    (function (ModuleSystem) {
        /* Resolvers*/
        function resolveProactive(resolver) {
            let declarationsWithRecursion = Array.from(declarations.listItemsWithRecursion());
            let matchingDeclaration = declarationsWithRecursion.find(declaration => {
                if (resolver.name == declaration.absoluteName) {
                    if (resolver.type == ModuleSystem.ResolverType.ModuleResolver) {
                        if (declaration instanceof ModuleSystem.ModuleDeclaration)
                            return true;
                    }
                    else if (resolver.type == ModuleSystem.ResolverType.ModuleMemberResolver) {
                        if (declaration instanceof ModuleSystem.ModuleMemberDeclaration)
                            return true;
                    }
                }
                return false;
            });
            if (matchingDeclaration)
                resolver.resolve(matchingDeclaration);
        }
        function resolvers_onListChanged(sender, e) {
            if (e.mode & Core.Collections.ListChangeMode.Added)
                for (let item of e.newItems)
                    resolveProactive(item);
        }
        let resolvers = new ModuleSystem.ResolverList();
        resolvers.listChangedEvent.attach(resolvers_onListChanged);
        function getResolvers() { return [...resolvers]; }
        ModuleSystem.getResolvers = getResolvers;
        class ModuleConstructionContextHandler {
            constructor(targetModule) {
                this.targetModule = targetModule;
            }
            defineProperty(target, propertyKey, attributes) {
                declareModuleMember(this.targetModule, String(propertyKey), attributes.value);
                return Reflect.defineProperty(target, propertyKey, attributes);
            }
            deleteProperty(target, propertyKey) {
                deleteModuleMember(this.targetModule, String(propertyKey));
                return Reflect.deleteProperty(target, propertyKey);
            }
        }
        ModuleSystem.ModuleConstructionContextHandler = ModuleConstructionContextHandler;
        function resolveRetroactive(declaration) {
            resolvers.resolveEvery(resolver => {
                if (declaration.absoluteName == resolver.name) {
                    if (resolver.type == ModuleSystem.ResolverType.ModuleResolver) {
                        if (declaration instanceof ModuleSystem.ModuleDeclaration)
                            return true;
                    }
                    else if (resolver.type == ModuleSystem.ResolverType.ModuleMemberResolver) {
                        if (declaration instanceof ModuleSystem.ModuleMemberDeclaration)
                            return true;
                    }
                }
                return false;
            }, declaration);
        }
        function declarations_onListChanged(sender, e) {
            if (e.mode & Core.Collections.ListChangeMode.Added)
                for (let declaration of e.newItems)
                    resolveRetroactive(declaration);
        }
        let declarations = new ModuleSystem.DeclarationList();
        declarations.listChangedEvent.attach(declarations_onListChanged);
        function getDeclarations() { return Array(...declarations); }
        ModuleSystem.getDeclarations = getDeclarations;
        ;
        /* User methods*/
        function resolveModuleMember(name) {
            let resolver = new ModuleSystem.Resolver(name, ModuleSystem.ResolverType.ModuleMemberResolver);
            //Add resolver
            resolvers.push(resolver);
            //Return resolver promise
            return resolver;
        }
        ModuleSystem.resolveModuleMember = resolveModuleMember;
        function resolveModule(name) {
            let resolver = new ModuleSystem.Resolver(name, ModuleSystem.ResolverType.ModuleResolver);
            //Add resolver
            resolvers.push(resolver);
            //Return resolver promise
            return resolver;
        }
        ModuleSystem.resolveModule = resolveModule;
        async function resolveMemberValue(name) {
            let resolver = resolveModuleMember(name);
            let member = await (resolver.promise);
            return member.getValue();
        }
        ModuleSystem.resolveMemberValue = resolveMemberValue;
        function declareModuleMember(parentModule, name, value) {
            let declaration = new ModuleSystem.ModuleMemberDeclaration(name); //Declare module member
            //Add declaration to module declaration
            parentModule.items.push(declaration);
        }
        ModuleSystem.declareModuleMember = declareModuleMember;
        function deleteModuleMember(parentModule, name) {
            //Get member declaration by name
            let member = parentModule.items.find(m => m.name === name);
            if (member === null)
                throw new Error("Cannot remove module member. Member not found.");
            //Remove member declaration
            parentModule.items.remove(member);
        }
        ModuleSystem.deleteModuleMember = deleteModuleMember;
        function declareModule(name, requires, constructor) {
            let dependencies = requires.map(n => resolveModule(n));
            let declaration = new ModuleSystem.ModuleDeclaration(name, dependencies, constructor); //Create module declaration
            //Add declaration
            declarations.push(declaration);
            //Construct module and return promise
            return declaration.construct();
        }
        ModuleSystem.declareModule = declareModule;
    })(ModuleSystem = Core.ModuleSystem || (Core.ModuleSystem = {}));
})(Core || (Core = {}));
//# sourceMappingURL=index.js.map