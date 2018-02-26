var Core;
(function (Core) {
    var Web;
    (function (Web) {
        Web.METHOD_GET = 'GET';
        Web.METHOD_HEAD = 'HEAD';
        Web.METHOD_POST = 'POST';
        Web.METHOD_PUT = 'PUT';
        Web.METHOD_DELETE = 'DELETE';
        Web.METHOD_CONNECT = 'CONNECT';
        Web.METHOD_OPTIONS = 'OPTIONS';
        Web.METHOD_TRACE = 'TRACE';
        Web.METHOD_PATCH = 'PATCH';
        Web.STATUS_CONTINUE = 100;
        Web.STATUS_SWITCHING_PROTOCOL = 101;
        Web.STATUS_PROCESSING = 102;
        Web.STATUS_OK = 200;
        Web.STATUS_CREATED = 201;
        Web.STATUS_ACCEPTED = 202;
        Web.STATUS_NON_AUTHORITATIVE_INFO = 203;
        Web.STATUS_NO_CONTENT = 204;
        Web.STATUS_RESET_CONTENT = 205;
        Web.STATUS_PARTIAL_CONTENT = 206;
        Web.STATUS_IM_USED = 226;
        Web.STATUS_MULTIPLE_CHOICE = 300;
        Web.STATUS_MOVED_PERMANENTLY = 301;
        Web.STATUS_FOUND = 302;
        Web.STATUS_SEE_OTHER = 303;
        Web.STATUS_NOT_MODIFIED = 304;
        Web.STATUS_TEMPORARY_REDIRECT = 307;
        Web.STATUS_PERMANENT_REDIRECT = 308;
        Web.STATUS_BAD_REQUEST = 400;
        Web.STATUS_PAYMENT_REQUIRED = 401;
        Web.STATUS_FORBIDDEN = 402;
        Web.STATUS_UNAUTHORIZED = 403;
        Web.STATUS_NOT_FOUND = 404;
        Web.STATUS_METHOD_NOT_ALLOWED = 405;
        Web.STATUS_NOT_ACCEPTABLE = 406;
        Web.STATUS_PROXY_AUTH_REQUIRED = 407;
        Web.STATUS_REQUEST_TIMEOUT = 408;
        Web.STATUS_CONFLICT = 409;
        Web.STATUS_GONE = 410;
        Web.STATUS_LENGTH_REQUIRED = 411;
        Web.STATUS_PRECONDITION_FAILED = 412;
        Web.STATUS_PAYLOAD_TOO_LARGE = 413;
        Web.STATUS_URI_TOO_LONG = 414;
        Web.STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
        Web.STATUS_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
        Web.STATUS_EXPECTATION_FAILED = 417;
        Web.STATUS_I_M_A_TEAPOT = 418;
        Web.STATUS_MISDIRECTED_REQUEST = 421;
        Web.STATUS_UNPROCESSABLE_ENTITY = 422;
        Web.STATUS_LOCKED = 423;
        Web.STATUS_FAILED_DEPENDENCY = 424;
        Web.STATUS_UPGRADE_REQUIRED = 426;
        Web.STATUS_PRECONDITION_REQUIRED = 428;
        Web.STATUS_TOO_MANY_REQUESTS = 429;
        Web.STATUS_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
        Web.STATUS_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
        Web.STATUS_INTERNAL_SERVER_ERROR = 500;
        Web.STATUS_NOT_IMPLEMENTED = 501;
        Web.STATUS_BAD_GATEWAY = 502;
        Web.STATUS_SERVICE_UNAVAILABLE = 503;
        Web.STATUS_GATEWAY_TIMEOUT = 504;
        Web.STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;
        Web.STATUS_VARIANT_ALSO_NEGOTIATES = 506;
        Web.STATUS_INSUFFICIENT_STORAGE = 507;
        Web.STATUS_LOOP_DETECTED = 508;
        Web.STATUS_NOT_EXTENDED = 510;
        Web.STATUS_NETWORK_AUTH_REQUIRED = 511;
        class LoadError extends Error {
            constructor(wrapper, message) {
                if (!(wrapper instanceof RequestWrapper))
                    throw new TypeError('Parameter "wrapper" is not a valid Core.Ajax.RequestWrapper.');
                if (typeof message !== Core.STRING && typeof message != Core.UNDEF)
                    throw new TypeError('Parameter "message" is not a valid String.');
                super();
                let xhr = wrapper.baseRequest;
                this.message = (message ? (message + ' ') : '') + wrapper.info.method + ' request to "' +
                    wrapper.info.url + '" failed with status code ' + xhr.status + '("' + xhr.statusText + '").';
            }
        }
        Web.LoadError = LoadError;
    })(Web = Core.Web || (Core.Web = {}));
})(Core || (Core = {}));
