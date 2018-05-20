/// <reference path="Core.Collections.Generic.d.ts" />
declare namespace Core.Exceptions {
    class ExceptionData extends Collections.Generic.Dictionary<any, any> {
    }
    class Exception {
        constructor(message?: string, innerException?: Error);
        readonly data: ExceptionData;
        toString(): void;
    }
    /**The exception that is thrown when one of the arguments provided to a method is not valid. */
    class ArgumentException extends Exception {
        constructor(argumentName: string, message?: string, innerException?: Error);
    }
    /**The exception that is thrown when no reference is passed to a method that requires an argument. */
    class ArgumentMissingException extends Exceptions.ArgumentException {
    }
    /**The exception that is thrown when a null reference is passed to a method that does not accept it as a valid
     * argument. */
    class ArgumentNullException extends ArgumentException {
    }
    /**The exception that is thrown when the value of an argument is outside the allowable range of values as defined
     * by the invoked method. */
    class ArgumentOutOfRangeException extends ArgumentException {
    }
    /**The exception that is thrown when the format of an argument is invalid, or when a composite format string is
     * not well formed. */
    class FormatException extends Exception {
    }
    /**The exception that is thrown when an attempt is made to access an element of an array or collection with an
     * index that is outside its bounds. */
    class IndexOutOfRangeException extends Exception {
    }
    /**A exce��o que � gerada quando uma chamada de m�todo � inv�lida para o estado atual do objeto. */
    class InvalidOperationException extends Exception {
    }
    /**The exception that is thrown when the key specified for accessing an element in a collection does not match
     * any key in the collection. */
    class KeyNotFoundException extends Exception {
    }
    /**The exception that is thrown when an invoked method is not supported, or when there is an attempt to read,
     * seek, or write to a stream that does not support the invoked functionality. */
    class NotSupported extends Exception {
    }
    /**The exception that is thrown when a requested method or operation is not implemented. */
    class NotImplemented extends Exception {
    }
    /**The exception that is thrown when the time allotted for a process or operation has expired. */
    class TimeoutException extends Exception {
    }
}
