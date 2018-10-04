var Core;
(function (Core) {
    let Validation;
    (function (Validation) {
        class RuntimeValidator {
            static _parameterTypeIsValid(paramValue, paramExpectedType) {
                function nonRecursive(paramValue, paramExpectedType) {
                    if (paramExpectedType instanceof Core.Type)
                        return new Core.Type(paramValue).equals(paramExpectedType);
                    else
                        throw new Core.Exceptions.ArgumentException("paramExpectedType", "The specified expected type is invalid.");
                }
                if (paramExpectedType instanceof Array) {
                    if (paramExpectedType.length == 0)
                        return true;
                    for (var i = 0; i < paramExpectedType.length; i++) {
                        let type = paramExpectedType[i];
                        if (nonRecursive(paramValue, type))
                            return true;
                    }
                }
                else
                    return nonRecursive(paramValue, paramExpectedType);
                return false;
            }
            static validateParameter(paramName, paramValue, paramExpectedType, isRequired = false, isNullable = true) {
                let isNull = paramValue === null, isUndefined = typeof paramValue == Core.UNDEF;
                if (isNull) {
                    if (!isNullable)
                        throw new Core.Exceptions.ArgumentNullException(paramName);
                }
                else if (isUndefined) {
                    if (isRequired)
                        throw new Core.Exceptions.ArgumentMissingException(paramName);
                }
                else {
                    if (!this._parameterTypeIsValid(paramValue, paramExpectedType))
                        throw new Core.Exceptions.ArgumentException(paramName);
                }
            }
            static validateArrayParameter(paramName, paramValue, memberExpectedType, itemIsNullable = true, arrayIsRequired = true, arrayIsNullable = false) {
                //Validate array
                this.validateParameter(paramName, paramValue, new Core.Type(Array), arrayIsRequired, arrayIsNullable);
                //Validate array items
                for (let i = 0; i < paramValue.length; i++) {
                    let member = paramValue[i];
                    this.validateParameter(`${paramName}[${i}]`, member, memberExpectedType, false, itemIsNullable);
                }
            }
        }
        Validation.RuntimeValidator = RuntimeValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Validation.js.map