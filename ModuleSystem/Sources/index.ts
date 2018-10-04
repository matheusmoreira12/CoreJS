///<reference path="../../Base/Sources/Collections.Dictionary.ts"/>
///<reference path="../../Base/Sources/Collections.List.ts"/>
///<reference path="../../Base/Sources/Promises.ts"/>
///<reference path="Resolver.ts"/>
///<reference path="Declaration.ts"/>

namespace Core.ModuleSystem {

    /* Resolvers*/
    function resolveProactive(resolver: Resolver) {
        let declarationsWithRecursion: Array<Declaration> = Array.from(declarations.listItemsWithRecursion());

        let matchingDeclaration: Declaration = declarationsWithRecursion.find(declaration => {
            if (resolver.name == declaration.absoluteName) {
                if (resolver.type == ResolverType.ModuleResolver) {
                    if (declaration instanceof ModuleDeclaration) return true;
                }
                else if (resolver.type == ResolverType.ModuleMemberResolver) {
                    if (declaration instanceof ModuleMemberDeclaration) return true;
                }
            }

            return false;
        });

        if (matchingDeclaration)
            resolver.resolve(matchingDeclaration);
    }

    function resolvers_onListChanged(sender: ResolverList, e: Collections.ListChangedEventArgs<Resolver>) {

        if (e.mode & Collections.ListChangeMode.Added)
            for (let item of e.newItems)
                resolveProactive(item);
    }

    let resolvers: ResolverList = new ResolverList();
    resolvers.listChangedEvent.attach(resolvers_onListChanged);

    export function getResolvers() { return [...resolvers] }

    export type ModuleConstructor = (this: ProxyConstructor, ...dependencies: object[]) => void;

    export class ModuleConstructionContextHandler implements ProxyHandler<object> {
        public constructor(targetModule: ModuleDeclaration) {
            this.targetModule = targetModule;
        }

        public defineProperty(target: object, propertyKey: PropertyKey, attributes: PropertyDescriptor): boolean {
            declareModuleMember(this.targetModule, String(propertyKey), attributes.value);

            return Reflect.defineProperty(target, propertyKey, attributes);
        }

        public deleteProperty(target: object, propertyKey: PropertyKey): boolean {
            deleteModuleMember(this.targetModule, String(propertyKey));

            return Reflect.deleteProperty(target, propertyKey);
        }

        public targetModule: ModuleDeclaration;
    }

    function resolveRetroactive(declaration: Declaration) {
        resolvers.resolveEvery(resolver => {
            if (declaration.absoluteName == resolver.name) {
                if (resolver.type == ResolverType.ModuleResolver) {
                    if (declaration instanceof ModuleDeclaration) return true;
                }
                else if (resolver.type == ResolverType.ModuleMemberResolver) {
                    if (declaration instanceof ModuleMemberDeclaration) return true;
                }
            }

            return false;
        }, declaration);
    }

    function declarations_onListChanged(sender: any, e: Collections.ListChangedEventArgs<Declaration>) {
        if (e.mode & Collections.ListChangeMode.Added)
            for (let declaration of e.newItems)
                resolveRetroactive(declaration);
    }

    let declarations: DeclarationList = new DeclarationList();
    declarations.listChangedEvent.attach(declarations_onListChanged);

    export function getDeclarations(): Declaration[] { return Array(...declarations); };

    /* User methods*/
    export function resolveModuleMember<TMember>(name: string): Resolver {
        let resolver = new Resolver(name, ResolverType.ModuleMemberResolver);

        //Add resolver
        resolvers.push(resolver);

        //Return resolver promise
        return resolver;
    }

    export function resolveModule(name: string): Resolver {
        let resolver = new Resolver(name, ResolverType.ModuleResolver);

        //Add resolver
        resolvers.push(resolver);

        //Return resolver promise
        return resolver;
    }

    export async function resolveMemberValue<TMember>(name: string): Promise<any> {
        let resolver: Resolver = resolveModuleMember(name);
        let member: ModuleMemberDeclaration<TMember> = await (resolver.promise);

        return member.getValue();
    }

    export function declareModuleMember<TValue>(parentModule: ModuleDeclaration, name: string, value: TValue): void {
        let declaration = new ModuleMemberDeclaration<TValue>(name); //Declare module member

        //Add declaration to module declaration
        parentModule.items.push(declaration);
    }

    export function deleteModuleMember(parentModule: ModuleDeclaration, name: string): void {
        //Get member declaration by name
        let member = parentModule.items.find(m => m.name === name);

        if (member === null)
            throw new Error("Cannot remove module member. Member not found.");

        //Remove member declaration
        parentModule.items.remove(member);
    }

    export function declareModule(name: string, requires: string[],
        constructor: ModuleConstructor): Promise<void> {
        let dependencies = requires.map(n => resolveModule(n));
        let declaration = new ModuleDeclaration(name, dependencies, constructor); //Create module declaration

        //Add declaration
        declarations.push(declaration);

        //Construct module and return promise
        return declaration.construct();
    }
}