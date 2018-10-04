///<reference path="../../Base/Sources/Promises.ts"/>

namespace Core.ModuleSystem {
    export enum ResolverType { NotSpecified, ModuleResolver, ModuleMemberResolver }

    const promiseKey = Symbol("promise");
    const isResolvedKey = Symbol("isResolved");
    const resolveKey = Symbol("resolve");
    const typeKey = Symbol("type");

    export class Resolver {
        constructor(name: string, type: ResolverType = ResolverType.NotSpecified) {
            this.identifier = new Identifier(name);
            this[typeKey] = type;

            let self = this;

            function handler(resolve: PromiseResolve<any>, reject: PromiseReject) {
                self[resolveKey] = resolve;
            }

            //Create resolver promise
            this[promiseKey] = new Promise<any>(handler);

            //Set isResolved flag
            this[isResolvedKey] = false;
        }

        public resolve(value: any) {
            if (this.isResolved)
                throw new Error("Cannot resolve. Resolver already resolved.");

            //Call promise resolve
            this[resolveKey](value);

            //Set isResolved flag
            this[isResolvedKey] = true;
        }

        get promise(): Promise<any> { return this[promiseKey]; }
        get isResolved(): boolean { return this[isResolvedKey]; };

        get type(): ResolverType { return this[typeKey]; }
        get name(): string { return this.identifier.toString(); }

        public identifier: Identifier;
    }

    export type ResolutionPredicate = (resolver: Resolver) => boolean;

    export class ResolverList extends Collections.List<Resolver> {
        public resolveEvery(predicate: ResolutionPredicate, value: any) {
            for (let resolver of this)
                if (predicate(resolver)) resolver.resolve(value);
        }
    }
}