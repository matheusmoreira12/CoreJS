var Core;
(function (Core) {
    class Type {
        /**
         * Creates a new instance of Type from the specified instance or constructor.
         * @param obj The instance or constructor the Type is being created from.
         */
        constructor(obj) {
            this._typeConstructor = Type._getConstructor(obj);
        }
        static _getConstructor(obj) {
            if (obj instanceof Function)
                return obj;
            else
                return obj.constructor;
        }
        static _getParentType(constr) {
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
        static equals(tSrc, tRef) {
            return Object.is(tSrc._typeConstructor, tRef._typeConstructor);
        }
        /** Returns the name of this Type.*/
        get name() {
            return this._typeConstructor.name;
        }
        /** Returns the parent type of this Type.*/
        get parentType() {
            return Type._getParentType(this._typeConstructor);
        }
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tRef The reference type.
         */
        equals(tRef) {
            return Type.equals(this, tRef);
        }
        /**Returns a string representing the inheritance tree for this type. */
        inheritanceToString() {
            let parentTypeNameArr = [], parentType = this;
            do {
                parentTypeNameArr.push(parentType.name);
            } while (parentType = parentType.parentType);
            return parentTypeNameArr.reverse().join("->");
        }
    }
    Core.Type = Type;
})(Core || (Core = {}));
//# sourceMappingURL=Core.Type.js.map