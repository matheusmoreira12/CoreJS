/// <reference path="Core.Exceptions.d.ts" />
declare namespace Core {
    namespace Validation {
        type ExpectedType = Type | Type[];
        class RuntimeValidator {
            private static _parameterTypeIsValid(paramValue, paramExpectedType);
            static validateParameter(paramName: string, paramValue: any, paramExpectedType: ExpectedType, isRequired?: boolean, isNullable?: boolean): void;
            static validateArrayParameter(paramName: string, paramValue: any[], memberExpectedType: ExpectedType, itemIsNullable?: boolean, arrayIsRequired?: boolean, arrayIsNullable?: boolean): void;
        }
    }
}
