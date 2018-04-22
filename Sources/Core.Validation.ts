///<reference path="Core.Exceptions.ts"/>

namespace Core {
    export namespace Validation {

        export type ExpectedType = Type | Type[];

        export class RuntimeValidator {
            private static _parameterTypeIsValid(paramValue: any, paramExpectedType: ExpectedType)
                : boolean {
                function nonRecursive(paramValue: any, paramExpectedType: ExpectedType) {
                    if (paramExpectedType instanceof Type)
                        return new Type(paramValue).equals(paramExpectedType);
                    else
                        throw new Exceptions.ArgumentException("paramExpectedType", "The specified expected type is invalid.");
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

            static validateParameter(paramName: string, paramValue: any, paramExpectedType: ExpectedType,
                isRequired: boolean = false, isNullable: boolean = true) {

                let isNull = paramValue === null,
                    isUndefined = typeof paramValue == UNDEF;

                if (isNull) {
                    if (!isNullable)
                        throw new Exceptions.ArgumentNullException(paramName);
                }
                else if (isUndefined) {
                    if (isRequired)
                        throw new Exceptions.ArgumentMissingException(paramName);
                }
                else {
                    if (!this._parameterTypeIsValid(paramValue, paramExpectedType))
                        throw new Exceptions.ArgumentException(paramName);
                }
            }

            static validateArrayParameter(paramName: string, paramValue: any[], memberExpectedType: ExpectedType,
                itemIsNullable: boolean = true, arrayIsRequired: boolean = true, arrayIsNullable: boolean = false) {
                //Validate array
                this.validateParameter(paramName, paramValue, new Type(Array), arrayIsRequired, arrayIsNullable);

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