namespace Core {
    export namespace Validation {

        export type ExpectedTypeDecorator = string | Function | (string | Function)[];

        export class Utils {
            private static _expectedTypeNameAsMessageTags(expectedType: Validation.ExpectedTypeDecorator) {
                if (expectedType instanceof Function && expectedType.length == 0)
                    return Exceptions.Exception.getMessageTag("type", expectedType.name);
                else if (typeof expectedType == STRING)
                    return Exceptions.Exception.getMessageTag("type", <string>expectedType);
                else
                    throw new Exceptions.InvalidParameterTypeException("expectedType", [STRING, Function],
                        "Cannot convert parameter {0} to text because it is not a {1}.");
            }

            public static expectedTypeNameAsMessageTags(expectedType: ExpectedTypeDecorator) {
                if (expectedType instanceof Array) {
                    let resultArr = new Array<string>(0);

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

        export class RuntimeValidator {
            private static __parameterTypeIsValid(paramValue: any, paramExpectedType: ExpectedTypeDecorator) {
                if (paramExpectedType instanceof Function)
                    return (paramValue instanceof paramExpectedType);
                else if (typeof paramExpectedType == STRING)
                    return typeof paramValue == paramExpectedType;
                else
                    throw new Exceptions.InvalidParameterTypeException("paramExpectedType", "Cannot validate parameter." +
                        " The specified expected type is invalid.");
            }

            private static _parameterTypeIsValid(paramValue: any, paramExpectedType: ExpectedTypeDecorator)
                : boolean {
                if (paramExpectedType instanceof Array) {
                    if (paramExpectedType.length == 0)
                        return true;

                    for (var i = 0; i < paramExpectedType.length; i++) {
                        let type = paramExpectedType[i];

                        if (this.__parameterTypeIsValid(paramValue, type))
                            return true;
                    }

                    return false;
                }
                else
                    return this.__parameterTypeIsValid(paramValue, paramExpectedType);
            }

            static validateParameter(paramName: string, paramValue: any, paramExpectedType: ExpectedTypeDecorator,
                isRequired: boolean = false, isNullable: boolean = true) {
                //Runtime validation
                if (!Object.is(this.validateParameter.caller, this.validateParameter)) {
                    this.validateParameter("paramName", paramName, STRING, true, false);
                    this.validateParameter("paramValue", paramValue, [], true);
                    this.validateParameter("paramExpectedType", paramExpectedType, [STRING, Function, Array], true, false);
                }

                let isNull = paramValue === null,
                    isUndefined = typeof paramValue == UNDEF;

                if (isNull) {
                    if (!isNullable)
                        throw new Exceptions.InvalidParameterException(paramName, "Parameter %0 is a non-nullable parameter.");
                }
                else if (isUndefined) {
                    if (isRequired)
                        throw new Exceptions.ParameterMissingException(paramName);
                }
                else {
                    if (!this._parameterTypeIsValid(paramValue, paramExpectedType))
                        throw new Exceptions.InvalidParameterTypeException(paramName, paramExpectedType);
                }
            }

            static validateArrayParameter(paramName: string, paramValue: any[], memberExpectedType: ExpectedTypeDecorator,
                isNullable: boolean = true) {
                //Runtime validation
                this.validateParameter("paramName", paramName, STRING, true, false);
                this.validateParameter("paramValue", paramValue, Array, true, false);
                this.validateParameter("memberExpectedType", paramName, [STRING, Function, Array], true, false);

                try {
                    for (let i = 0; i < paramValue.length; i++) {
                        let member = paramValue[i];
                        RuntimeValidator.validateParameter(paramName, member, memberExpectedType, false, isNullable);
                    }
                }
                catch (e) {
                    throw (e);
                }
            }
        }
    }
}