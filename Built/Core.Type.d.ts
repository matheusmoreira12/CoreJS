declare namespace Core {
    class Type {
        private static _getConstructor(obj);
        private static _getParentType(constr);
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tSrc The source type.
         * @param tRef The reference type.
         */
        static equals(tSrc: Type, tRef: Type): boolean;
        /**
         * Creates a new instance of Type from the specified instance or constructor.
         * @param obj The instance or constructor the Type is being created from.
         */
        constructor(obj: Object | Function);
        private _typeConstructor;
        /** Returns the name of this Type.*/
        readonly name: string;
        /** Returns the parent type of this Type.*/
        readonly parentType: Type;
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tRef The reference type.
         */
        equals(tRef: Type): boolean;
        /**Returns a string representing the inheritance tree for this type. */
        inheritanceToString(): string;
    }
}
