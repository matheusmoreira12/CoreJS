///<reference path="Core.ts"/>
///<reference path="Core.Validation.ts"/>
///<reference path="Core.StringUtils.ts"/>
var Core;
(function (Core) {
    var Exceptions;
    (function (Exceptions) {
        class Exception extends Error {
            constructor(messageXml, innerException, ...extraParams) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("messageXml", messageXml, String);
                Core.Validation.RuntimeValidator.validateParameter("innerException", innerException, Error);
                //Message formatting
                messageXml = Core.StringUtils.format(messageXml, ...extraParams);
                let messageText = Exception.getMessagePlainText(messageXml);
                //Initialization
                super(messageText);
                this.messageXml = messageXml;
                this.extraParams = extraParams;
            }
            static getMessagePlainText(messageXml) {
                //remove all xml tags from messageXml
                return messageXml.replace(/<.*>/g, "\"");
            }
            static getMessageTag(tagName, content) {
                return Core.StringUtils.format("<{0}>{1}</{0}>", tagName, content);
            }
        }
        Exceptions.Exception = Exception;
        class InvalidOperationException extends Exception {
            constructor(messageXml, innerException, ...extraParams) {
                //Initialization
                super(messageXml, innerException, ...extraParams);
            }
        }
        Exceptions.InvalidOperationException = InvalidOperationException;
        class InvalidTypeException extends Exception {
            constructor(varName, expectedType, messageXml, innerException, ...extraParams) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("expectedType", expectedType, [Core.STRING, Function, Array]);
                messageXml = messageXml || "Invalid type for variable {0}. A value of type {1} was expected.";
                extraParams = [Core.Validation.Utils.expectedTypeNameAsMessageTags(expectedType), ...extraParams];
                //Initialization
                super(messageXml, innerException, ...extraParams);
            }
        }
        Exceptions.InvalidTypeException = InvalidTypeException;
        class InvalidParameterException extends Exception {
            constructor(paramName, messageXml, innerException, ...extraParams) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, "string");
                messageXml = messageXml || "Invalid value for parameter {0}.";
                extraParams = [Exception.getMessageTag("param", paramName), ...extraParams];
                //Initialization
                super(messageXml, innerException, ...extraParams);
                this.paramName = paramName;
            }
        }
        Exceptions.InvalidParameterException = InvalidParameterException;
        class InvalidParameterTypeException extends Exception {
            constructor(paramName, expectedType, messageXml, innerException, ...extraParams) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("expectedType", expectedType, [Core.STRING, Function, Array], true, false);
                //Message XML fallback value
                messageXml = messageXml || "Invalid value for parameter {0}. A value of type {1} was expected.";
                extraParams = [Exception.getMessageTag("param", paramName),
                    Core.Validation.Utils.expectedTypeNameAsMessageTags(expectedType), ...extraParams];
                //Initialization
                super(messageXml, innerException, ...extraParams);
                this.paramName = paramName;
            }
        }
        Exceptions.InvalidParameterTypeException = InvalidParameterTypeException;
        class ParameterMissingException extends Exception {
            constructor(paramName, messageXml, innerException, ...extraParams) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, "string");
                messageXml = messageXml || "Parameter {0} is required and must be specified.";
                extraParams.push(Exception.getMessageTag("param", paramName));
                //Initialization
                super(messageXml, innerException, ...extraParams);
                this.paramName = paramName;
            }
        }
        Exceptions.ParameterMissingException = ParameterMissingException;
    })(Exceptions = Core.Exceptions || (Core.Exceptions = {}));
})(Core || (Core = {}));
