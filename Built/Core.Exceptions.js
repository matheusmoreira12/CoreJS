var Core;
(function (Core) {
    var Exceptions;
    (function (Exceptions) {
        class ExceptionData extends Core.Collections.Generic.Dictionary {
        }
        Exceptions.ExceptionData = ExceptionData;
        let ExceptionSymbols;
        (function (ExceptionSymbols) {
            ExceptionSymbols.data = Symbol.for("data");
        })(ExceptionSymbols || (ExceptionSymbols = {}));
        class Exception {
            constructor(message = "", innerException = null) {
                this[ExceptionSymbols.data] = new Core.Collections.Generic.Dictionary();
                this.data["message"] = message;
                this.data["innerException"] = innerException;
            }
            get data() {
                return this[ExceptionSymbols.data];
            }
            toString() {
            }
        }
        Exceptions.Exception = Exception;
        /**The exception that is thrown when one of the arguments provided to a method is not valid. */
        class ArgumentException extends Exception {
            constructor(argumentName, message = "", innerException = null) {
                super(message, innerException);
                this.data["argumentName"] = argumentName;
            }
        }
        Exceptions.ArgumentException = ArgumentException;
        /**The exception that is thrown when no reference is passed to a method that requires an argument. */
        class ArgumentMissingException extends Exceptions.ArgumentException {
        }
        Exceptions.ArgumentMissingException = ArgumentMissingException;
        /**The exception that is thrown when a null reference is passed to a method that does not accept it as a valid
         * argument. */
        class ArgumentNullException extends ArgumentException {
        }
        Exceptions.ArgumentNullException = ArgumentNullException;
        /**The exception that is thrown when the value of an argument is outside the allowable range of values as defined
         * by the invoked method. */
        class ArgumentOutOfRangeException extends ArgumentException {
        }
        Exceptions.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
        /**The exception that is thrown when the format of an argument is invalid, or when a composite format string is
         * not well formed. */
        class FormatException extends Exception {
        }
        Exceptions.FormatException = FormatException;
        /**The exception that is thrown when an attempt is made to access an element of an array or collection with an
         * index that is outside its bounds. */
        class IndexOutOfRangeException extends Exception {
        }
        Exceptions.IndexOutOfRangeException = IndexOutOfRangeException;
        /**A exce��o que � gerada quando uma chamada de m�todo � inv�lida para o estado atual do objeto. */
        class InvalidOperationException extends Exception {
        }
        Exceptions.InvalidOperationException = InvalidOperationException;
        /**The exception that is thrown when the key specified for accessing an element in a collection does not match
         * any key in the collection. */
        class KeyNotFoundException extends Exception {
        }
        Exceptions.KeyNotFoundException = KeyNotFoundException;
        /**The exception that is thrown when an invoked method is not supported, or when there is an attempt to read,
         * seek, or write to a stream that does not support the invoked functionality. */
        class NotSupported extends Exception {
        }
        Exceptions.NotSupported = NotSupported;
        /**The exception that is thrown when a requested method or operation is not implemented. */
        class NotImplemented extends Exception {
        }
        Exceptions.NotImplemented = NotImplemented;
        /**The exception that is thrown when the time allotted for a process or operation has expired. */
        class TimeoutException extends Exception {
        }
        Exceptions.TimeoutException = TimeoutException;
    })(Exceptions = Core.Exceptions || (Core.Exceptions = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Exceptions.js.map