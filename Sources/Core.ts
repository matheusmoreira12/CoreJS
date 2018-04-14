namespace Core {

    export const UNDEF = "undefined";
    export const STRING = "string";
    export const NUMBER = "number";
    export const BOOL = "boolean";

    export class Type {

        private static * _iterateSuperclasses(obj: Object): IterableIterator<Object> {
            while (obj) {
                yield obj;

                obj = Object.getPrototypeOf(obj);
            }
        }

        private static _stringifyType(obj: Object) {
            let superclasses = Array.from(this._iterateSuperclasses(obj)),
                superclassNames = superclasses.map(sc => {

                    if (sc instanceof Function)
                        return (<Function>sc).name;
                    else
                        return (<Object>sc).constructor.name;

                });

            return superclassNames.reverse().join(">");
        }

        private static _hashifyType(obj: Object | Function): number {
            let typeAsString = this._stringifyType(obj),
                hashCode = Hash.generateHashCode(typeAsString);

            return hashCode;
        }

        public equals(targetType: Type): boolean {
            return targetType.hashCode === this.hashCode;
        }

        public name: string;
        public hashCode: number;

        public constructor(obj: Object | Function) {
            if (!(obj instanceof Function))
                obj = (<Object>obj).constructor;

            this.name = (<Function>obj).name;
            this.hashCode = Type._hashifyType(obj);

            return Object.freeze(this);
        }
    }
}