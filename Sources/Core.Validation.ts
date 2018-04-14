namespace Core {
    export namespace Validation {

        export type ExpectedTypeDecorator = string | Function | (string | Function)[];

        export class Utils {
            private static _expectedTypeNameAsMessageTags(expectedType: Validation.ExpectedTypeDecorator) {
                if (expectedType instanceof Function)
                    return Exceptions.Exception.getMessageTag("type", expectedType.name);
                else if (typeof expectedType == STRING)
                    return Exceptions.Exception.getMessageTag("type", <string>expectedType);

                return null;
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

                let isNull = paramValue === null,
                    isUndefined = typeof paramValue == UNDEF;

                if (isNull) {
                    if (!isNullable)
                        throw new Exceptions.InvalidParameterException(paramName, "Parameter {0} is a non-nullable parameter.");
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
                itemIsNullable: boolean = true, arrayIsRequired: boolean = true, arrayIsNullable: boolean = false) {
                //Validate array
                this.validateParameter(paramName, paramValue, Array, arrayIsRequired, arrayIsNullable);

                //Validate array items
                for (let i = 0; i < paramValue.length; i++) {
                    let member = paramValue[i];

                    this.validateParameter(`${paramName}[${i}]`, member, memberExpectedType,
                        false, itemIsNullable);
                }
            }
        }
    }
}