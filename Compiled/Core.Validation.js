var Core;
(function (Core) {
    let Validation;
    (function (Validation) {
        class Utils {
            static _expectedTypeNameAsMessageTags(expectedType) {
                if (expectedType instanceof Function && expectedType.length == 0)
                    return Core.Exceptions.Exception.getMessageTag("type", expectedType.name);
                else if (typeof expectedType == Core.STRING)
                    return Core.Exceptions.Exception.getMessageTag("type", expectedType);
                else
                    throw new Core.Exceptions.InvalidParameterTypeException("expectedType", [Core.STRING, Function], "Cannot convert parameter {0} to text because it is not a {1}.");
            }
            static expectedTypeNameAsMessageTags(expectedType) {
                if (expectedType instanceof Array) {
                    let resultArr = new Array(0);
                    for (var i = 0; i < expectedType.length; i++) {
                        let type = expectedType[i];
                        resultArr.push(this._expectedTypeNameAsMessageTags(type));
                    }
                    //Join array with connectives 
                    return resultArr.join(" or ");
                }
                else
                    return this._expectedTypeNameAsMessageTags(expectedType);
            }
        }
        Validation.Utils = Utils;
        class RuntimeValidator {
            static _parameterTypeIsValid(paramValue, paramExpectedType) {
                if (paramExpectedType instanceof Function)
                    return (paramValue instanceof paramExpectedType);
                else if (typeof paramExpectedType == Core.STRING)
                    return typeof paramValue == paramExpectedType;
                else
                    throw new Core.Exceptions.InvalidParameterTypeException("paramExpectedType", "Cannot validate parameter." +
                        " The specified expected type is invalid.");
            }
            static parameterTypeIsValid(paramValue, paramExpectedType) {
                if (paramExpectedType instanceof Array) {
                    if (paramExpectedType.length == 0)
                        return true;
                    for (var i = 0; i < paramExpectedType.length; i++) {
                        let type = paramExpectedType[i];
                        if (this._parameterTypeIsValid(paramValue, type))
                            return true;
                    }
                    return false;
                }
                else
                    return this._parameterTypeIsValid(paramValue, paramExpectedType);
            }
            static validateParameter(paramName, paramValue, paramExpectedType, isRequired = false, isNullable = true) {
                let isNull = paramValue === null, isUndefined = typeof paramValue == Core.UNDEF;
                if (isNull) {
                    if (!isNullable)
                        throw new Core.Exceptions.InvalidParameterException(paramName, "Parameter %0 is a non-nullable parameter.");
                }
                else if (isUndefined) {
                    if (isRequired)
                        throw new Core.Exceptions.ParameterMissingException(paramName);
                }
                else {
                    if (!this.parameterTypeIsValid(paramValue, paramExpectedType))
                        throw new Core.Exceptions.InvalidParameterTypeException(paramName, paramExpectedType);
                }
            }
        }
        Validation.RuntimeValidator = RuntimeValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
