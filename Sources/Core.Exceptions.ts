///<reference path="Core.Collections.Generic.ts"/>

namespace Core.Exceptions {

    export class ExceptionData extends Collections.Generic.Dictionary<any, any> {
    }

    namespace ExceptionSymbols {
        export const data = Symbol.for("data");
    }

    export class Exception {

        constructor(message: string = "", innerException: Error = null) {
            this[ExceptionSymbols.data] = new Collections.Generic.Dictionary<any, any>();

            this.data["message"] = message;
            this.data["innerException"] = innerException;
        }

        public get data(): ExceptionData {
            return this[ExceptionSymbols.data];
        }

        public toString() {

        }
    }

    /**The exception that is thrown when one of the arguments provided to a method is not valid. */
    export class ArgumentException extends Exception {
        constructor(argumentName: string, message: string = "", innerException: Error = null) {
            super(message, innerException);

            this.data["argumentName"] = argumentName;
        }
    }

    /**The exception that is thrown when no reference is passed to a method that requires an argument. */
    export class ArgumentMissingException extends Exceptions.ArgumentException { }

    /**The exception that is thrown when a null reference is passed to a method that does not accept it as a valid
     * argument. */
    export class ArgumentNullException extends ArgumentException {

    }

    /**The exception that is thrown when the value of an argument is outside the allowable range of values as defined 
     * by the invoked method. */
    export class ArgumentOutOfRangeException extends ArgumentException {

    }

    /**The exception that is thrown when the format of an argument is invalid, or when a composite format string is 
     * not well formed. */
    export class FormatException extends Exception { }

    /**The exception that is thrown when an attempt is made to access an element of an array or collection with an 
     * index that is outside its bounds. */
    export class IndexOutOfRangeException extends Exception { }

    /**A exceção que é gerada quando uma chamada de método é inválida para o estado atual do objeto. */
    export class InvalidOperationException extends Exception { }

    /**The exception that is thrown when the key specified for accessing an element in a collection does not match 
     * any key in the collection. */
    export class KeyNotFoundException extends Exception { }

    /**The exception that is thrown when an invoked method is not supported, or when there is an attempt to read, 
     * seek, or write to a stream that does not support the invoked functionality. */
    export class NotSupported extends Exception { }

    /**The exception that is thrown when a requested method or operation is not implemented. */
    export class NotImplemented extends Exception { }

    /**The exception that is thrown when the time allotted for a process or operation has expired. */
    export class TimeoutException extends Exception { }
}