



namespace Core.Exceptions {

    export class Exception extends Error {

        protected static getMessagePlainText(messageXml: string) {
            //remove all xml tags from messageXml
            return messageXml.replace(/<.*>/g, "\"");
        }

        public static getMessageTag(tagName: string, content: string) { 
            return StringUtils.format("<{0}>{1}</{0}>", tagName, content);
        }

        constructor(messageXml?: string, innerException?: Error, ...extraParams: any[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("messageXml", messageXml, String);
            Validation.RuntimeValidator.validateParameter("innerException", innerException, Error);

            //Message formatting
            messageXml = StringUtils.format(messageXml, ...extraParams);

            let messageText = Exception.getMessagePlainText(messageXml);

            //Initialization
            super(messageText);
            this.messageXml = messageXml;
            this.extraParams = extraParams;
        }

        messageXml: string;
        innerException: Error;
        extraParams: any[];
    }

    export class InvalidOperationException extends Exception {
        constructor(messageXml?: string, innerException?: Error, ...extraParams: any[]) {

            //Initialization
            super(messageXml, innerException, ...extraParams);
        }
    }

    export class InvalidTypeException extends Exception {
        constructor(varName: string, expectedType: Validation.ExpectedTypeDecorator, messageXml?: string, innerException?: Error, ...extraParams: any[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("expectedType", expectedType, [STRING, Function, Array]);

            messageXml = messageXml || "Invalid type for variable {0}. A value of type {1} was expected.";

            extraParams = [Validation.Utils.expectedTypeNameAsMessageTags(expectedType), ...extraParams];

            //Initialization
            super(messageXml, innerException, ...extraParams);
        }

        varName: string;
    }

    export class InvalidParameterException extends Exception {
        constructor(paramName: string, messageXml?: string, innerException?: Error, ...extraParams: any[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("paramName", paramName, "string");

            messageXml = messageXml || "Invalid value for parameter {0}.";

            extraParams = [Exception.getMessageTag("param", paramName), ...extraParams];

            //Initialization
            super(messageXml, innerException, ...extraParams);
            this.paramName = paramName;
        }

        paramName: string;
    }

    export class InvalidParameterTypeException extends Exception implements InvalidParameterException {

        constructor(paramName: string, expectedType: Validation.ExpectedTypeDecorator, messageXml?: string,
            innerException?: Error, ...extraParams: any[]) {

            //Runtime validation
            Validation.RuntimeValidator.validateParameter("paramName", paramName, STRING, true, false)
            Validation.RuntimeValidator.validateParameter("expectedType", expectedType, [STRING, Function, Array], true, false);

            //Message XML fallback value
            messageXml = messageXml || "Invalid value for parameter {0}. A value of type {1} was expected.";

            extraParams = [Exception.getMessageTag("param", paramName),
                Validation.Utils.expectedTypeNameAsMessageTags(expectedType), ...extraParams];

            //Initialization
            super(messageXml, innerException, ...extraParams);
            this.paramName = paramName;
        }

        paramName: string;
        expectedType: string | string[] | Function;
    }

    export class ParameterMissingException extends Exception implements InvalidParameterException {
        constructor(paramName: string, messageXml?: string, innerException?: Error, ...extraParams: any[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("paramName", paramName, "string");

            messageXml = messageXml || "Parameter {0} is required and must be specified.";
            extraParams.push(Exception.getMessageTag("param", paramName));

            //Initialization
            super(messageXml, innerException, ...extraParams);
            this.paramName = paramName;
        }

        paramName: string;
    }
}