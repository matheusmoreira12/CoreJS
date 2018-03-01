namespace Core.Web {

    export const METHOD_GET = 'GET';
    export const METHOD_HEAD = 'HEAD';
    export const METHOD_POST = 'POST';
    export const METHOD_PUT = 'PUT';
    export const METHOD_DELETE = 'DELETE';
    export const METHOD_CONNECT = 'CONNECT';
    export const METHOD_OPTIONS = 'OPTIONS';
    export const METHOD_TRACE = 'TRACE';
    export const METHOD_PATCH = 'PATCH';

    export const STATUS_CONTINUE = 100;
    export const STATUS_SWITCHING_PROTOCOL = 101;
    export const STATUS_PROCESSING = 102;

    export const STATUS_OK = 200;
    export const STATUS_CREATED = 201;
    export const STATUS_ACCEPTED = 202;
    export const STATUS_NON_AUTHORITATIVE_INFO = 203;
    export const STATUS_NO_CONTENT = 204;
    export const STATUS_RESET_CONTENT = 205;
    export const STATUS_PARTIAL_CONTENT = 206;
    export const STATUS_IM_USED = 226;

    export const STATUS_MULTIPLE_CHOICE = 300;
    export const STATUS_MOVED_PERMANENTLY = 301;
    export const STATUS_FOUND = 302;
    export const STATUS_SEE_OTHER = 303;
    export const STATUS_NOT_MODIFIED = 304;
    export const STATUS_TEMPORARY_REDIRECT = 307;
    export const STATUS_PERMANENT_REDIRECT = 308;

    export const STATUS_BAD_REQUEST = 400;
    export const STATUS_PAYMENT_REQUIRED = 401;
    export const STATUS_FORBIDDEN = 402;
    export const STATUS_UNAUTHORIZED = 403;
    export const STATUS_NOT_FOUND = 404;
    export const STATUS_METHOD_NOT_ALLOWED = 405;
    export const STATUS_NOT_ACCEPTABLE = 406;
    export const STATUS_PROXY_AUTH_REQUIRED = 407;
    export const STATUS_REQUEST_TIMEOUT = 408;
    export const STATUS_CONFLICT = 409;
    export const STATUS_GONE = 410;
    export const STATUS_LENGTH_REQUIRED = 411;
    export const STATUS_PRECONDITION_FAILED = 412;
    export const STATUS_PAYLOAD_TOO_LARGE = 413;
    export const STATUS_URI_TOO_LONG = 414;
    export const STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
    export const STATUS_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    export const STATUS_EXPECTATION_FAILED = 417;
    export const STATUS_I_M_A_TEAPOT = 418;
    export const STATUS_MISDIRECTED_REQUEST = 421;
    export const STATUS_UNPROCESSABLE_ENTITY = 422;
    export const STATUS_LOCKED = 423;
    export const STATUS_FAILED_DEPENDENCY = 424;
    export const STATUS_UPGRADE_REQUIRED = 426;
    export const STATUS_PRECONDITION_REQUIRED = 428;
    export const STATUS_TOO_MANY_REQUESTS = 429;
    export const STATUS_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    export const STATUS_UNAVAILABLE_FOR_LEGAL_REASONS = 451;

    export const STATUS_INTERNAL_SERVER_ERROR = 500;
    export const STATUS_NOT_IMPLEMENTED = 501;
    export const STATUS_BAD_GATEWAY = 502;
    export const STATUS_SERVICE_UNAVAILABLE = 503;
    export const STATUS_GATEWAY_TIMEOUT = 504;
    export const STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;
    export const STATUS_VARIANT_ALSO_NEGOTIATES = 506;
    export const STATUS_INSUFFICIENT_STORAGE = 507;
    export const STATUS_LOOP_DETECTED = 508;
    export const STATUS_NOT_EXTENDED = 510;
    export const STATUS_NETWORK_AUTH_REQUIRED = 511;

    export class LoadException extends Exceptions.Exception {
        constructor(ajax: AjaxRequest, message?: string) {
            Validation.RuntimeValidator.validateParameter("ajax", ajax, AjaxRequest, true, false);
            Validation.RuntimeValidator.validateParameter("messaage", message, STRING, false);

            let xhr = ajax.baseRequest;

            let messageXml = StringUtils.format("{0}{1} request to {2} failed with status code {3}({4}).",
                message ? (message + " ") : "", ajax.info.method, ajax.info.url, xhr.status, xhr.statusText);
            
            super(messageXml);
        }
    }

}