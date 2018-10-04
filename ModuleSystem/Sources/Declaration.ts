///<reference path="../../Base/Sources/Collections.TreeItem.ts"/>
///<reference path="../../Base/Sources/Collections.List.ts"/>

namespace Core.ModuleSystem {

    /**
     * Represents a declaration.
     * Contains all the required information for a declaration, like an identifier, a parent module and a module recursion
     * list.
     */
    export abstract class Declaration extends Collections.TreeItem<Declaration> {
        constructor(name: string, ...items: Declaration[]) {
            super(...items);

            this.identifier = new Identifier(name);
        }

        public delete(): void {
            if (this.parent !== null)
                this.parent.items.remove(this);
        }

        public get absoluteIdentifier(): Identifier {
            return this.parent ? (this.parent as Declaration).absoluteIdentifier.concat(this.identifier)
                : this.identifier;
        }

        public get name() { return this.identifier.toString(); }
        public get absoluteName() { return this.absoluteIdentifier.toString(); }

        public identifier: Identifier;

        public getValue(): object { return; }
    }

    const resolvedDependenciesKey = Symbol("resolvedDependencies");
    const dataStorageIdKey = Symbol("dataStorageId");

    /**
     * Represents a module declaration.
     */
    export class ModuleDeclaration extends Declaration {
        private _intializeDataStorage() { this[dataStorageIdKey] = DeclarationStorage.storeData({}); }

        public constructor(name: string, dependencies: Resolver[], constructor: ModuleConstructor) {
            super(name);

            this.dependencies = dependencies;
            this.moduleConstructor = constructor;

            this[resolvedDependenciesKey] = null;

            this._intializeDataStorage();
        }

        private async * _resolveDependencies(): AsyncIterable<ModuleDeclaration> {
            for (let dependency of this.dependencies)
                yield await dependency.promise;
        }

        public async construct(): Promise<void> {
            let value = this.getValue();

            let resolvedDependencies = []; //Empty resolved dependencies

            //Resolve dependencies
            for await (let dependency of this._resolveDependencies())
                resolvedDependencies.push(dependency);

            let constructionContext = new Proxy(value, new ModuleConstructionContextHandler(this)); //Create context

            let dependencyValues: object[] = resolvedDependencies.map(d => d.getValue()); //Get resolved dependency values

            //Construct module using the provided constructor
            await this.moduleConstructor.call(constructionContext, dependencyValues);
        }

        public get resolvedDependencies(): ModuleDeclaration[] { return this[resolvedDependenciesKey]; }

        public dependencies: Resolver[];
        public moduleConstructor: ModuleConstructor;

        public getValue(): object { return DeclarationStorage.retrieveData(this[dataStorageIdKey]); }
    }

    /**
     * Represents a module member declaration
     */
    export class ModuleMemberDeclaration<TMember> extends Declaration {
        public constructor(name: string) {
            super(name);
        }

        public getValue(): object {
            let parentValue: object = (this.parent as ModuleDeclaration).getValue();

            return parentValue[this.name];
        }
    }

    export class DeclarationList extends Collections.List<Declaration> {

        protected _onListChanged(sender: Collections.List<Declaration>,
            e: Collections.ListChangedEventArgs<Declaration>) {
            super._onListChanged(sender, e);

            if (e.mode & Collections.ListChangeMode.Added)
                for (let declaration of e.newItems) declaration.items.listChangedEvent.attach(this.listChangedEvent);

            if (e.mode & Collections.ListChangeMode.Removed)
                for (let declaration of e.oldItems) declaration.items.listChangedEvent.detach(this.listChangedEvent);
        }

        public containsName(name: string): boolean { return this.findIndex(i => i.name == name) > -1; }

        public getByAbsoluteName(absoluteName: string): Declaration {
            let recursiveItems = Array.from(this.listItemsWithRecursion());

            return recursiveItems.find(d => d.absoluteName == absoluteName);
        }

        public *listItemsWithRecursion(): Iterable<Declaration> {
            yield* this;

            for (let item of this)
                yield* item.listItemsWithRecursion();
        }
    }
}