namespace Core {

    export class Type {

        private static _getConstructor(obj: Object | Function): Function {
            if (obj instanceof Function)
                return obj;
            else
                return obj.constructor;
        }

        private static _getParentType(constr: Function): Type {
            let superclass = Object.getPrototypeOf(constr.prototype);

            if (superclass === null)
                return null;

            return new Type(superclass);
        }

        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tSrc The source type.
         * @param tRef The reference type.
         */
        public static equals(tSrc: Type, tRef: Type): boolean {
            return Object.is(tSrc._typeConstructor, tRef._typeConstructor);
        }

        /**
         * Creates a new instance of Type from the specified instance or constructor.
         * @param obj The instance or constructor the Type is being created from.
         */
        public constructor(obj: Object | Function) {
            this._typeConstructor = Type._getConstructor(obj);
        }

        private _typeConstructor: Function;

        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tRef The reference type.
         */
        public equals(tRef: Type): boolean {
            return Type.equals(this, tRef);
        }

        /** Returns the name of this Type.*/
        public get name(): string {
            return this._typeConstructor.name;
        }

        /** Returns the parent type of this Type.*/
        public get parentType(): Type {
            return Type._getParentType(this._typeConstructor);
        }
    }
}