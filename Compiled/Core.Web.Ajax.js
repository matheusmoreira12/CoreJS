///<reference path="Core.ts"/>
///<reference path="Core.Web.ts"/>
///<reference path="Core.Events.ts"/>
var Core;
(function (Core) {
    var Web;
    (function (Web) {
        class AjaxRequestOptions {
            constructor(async, data, user, password) {
                //Runtime validation
                if (async !== null && typeof async != Core.UNDEF && typeof async != Core.BOOL)
                    throw TypeError('Parameter "async" is not a valid Boolean.');
                if (data !== null && typeof data != Core.UNDEF && typeof data != Core.STRING && !(data instanceof Document))
                    throw TypeError('Parameter "data" is not a valid Document or String.');
                if (user !== null && typeof user != Core.UNDEF && typeof user != Core.STRING)
                    throw TypeError('Parameter "user" is not a valid Boolean.');
                if (password !== null && typeof password != Core.UNDEF && typeof password != Core.STRING)
                    throw TypeError('Parameter "password" is not a valid Boolean.');
                this.asynchronous = async;
                this.user = user;
                this.password = password;
                this.data = data;
            }
        }
        Web.AjaxRequestOptions = AjaxRequestOptions;
        class AjaxRequestInfo {
            constructor(method, url, options) {
                //Runtime validation
                if (typeof method != Core.STRING)
                    throw TypeError('Parameter "method" is not a valid String.');
                if (typeof url != Core.STRING)
                    throw TypeError('Parameter "url" is not a valid String.');
                if (options !== null && typeof options != Core.UNDEF && !(options instanceof AjaxRequestOptions))
                    throw TypeError('Parameter "method" is not a valid String.');
                this.method = method;
                this.url = url;
                this.options = options || new AjaxRequestOptions();
            }
        }
        Web.AjaxRequestInfo = AjaxRequestInfo;
        class AjaxRequest {
            constructor(method, url, options) {
                this.doneEvent = new Core.Events.AjaxEvent(this);
                this.loadedEvent = new Core.Events.AjaxEvent(this);
                this.errorEvent = new Core.Events.AjaxEvent(this);
                this.headersReceivedEvent = new Core.Events.AjaxEvent(this);
                this.loadingEvent = new Core.Events.AjaxEvent(this);
                this.openedEvent = new Core.Events.AjaxEvent(this);
                this.unsentEvent = new Core.Events.AjaxEvent(this);
                this.progressEvent = new Core.Events.ProgressEvent(this);
                this.info = new AjaxRequestInfo(method, url, options);
                this.createAndOpenRequest(method, url, options);
            }
            requestReadyStateChanged() {
                let xhr = this.baseRequest;
                let info = this.info;
                switch (xhr.readyState) {
                    case XMLHttpRequest.DONE:
                        this.doneEvent.invoke();
                        if (xhr.status == Web.STATUS_OK)
                            this.loadedEvent.invoke();
                        else {
                            this.errorEvent.invoke();
                        }
                        break;
                    case XMLHttpRequest.HEADERS_RECEIVED:
                        this.headersReceivedEvent.invoke();
                        break;
                    case XMLHttpRequest.LOADING:
                        this.loadingEvent.invoke();
                        break;
                    case XMLHttpRequest.OPENED:
                        this.openedEvent.invoke();
                        break;
                    case XMLHttpRequest.UNSENT:
                        this.unsentEvent.invoke();
                        break;
                }
            }
            requestProgress(event) {
                let loaded = event.loaded, total = event.total, progressPercentage = loaded / total;
                this.progressEvent.invoke(loaded, total, progressPercentage);
            }
            createAndOpenRequest(method, url, options) {
                let xhr = new XMLHttpRequest();
                xhr.open(method, url, options.asynchronous, options.user, options.password);
                xhr.send(options.data);
                xhr.onreadystatechange = () => this.requestReadyStateChanged();
                this.baseRequest = xhr;
            }
        }
        Web.AjaxRequest = AjaxRequest;
        class Ajax {
            static get(url, options) {
                return new AjaxRequest(Web.METHOD_GET, url, options);
            }
            static head(url, options) {
                return new AjaxRequest(Web.METHOD_HEAD, url, options);
            }
            static post(url, options) {
                return new AjaxRequest(Web.METHOD_POST, url, options);
            }
            static put(url, options) {
                return new AjaxRequest(Web.METHOD_PUT, url, options);
            }
            static delete(url, options) {
                return new AjaxRequest(Web.METHOD_DELETE, url, options);
            }
            static connect(url, options) {
                return new AjaxRequest(Web.METHOD_CONNECT, url, options);
            }
            static options(url, options) {
                return new AjaxRequest(Web.METHOD_OPTIONS, url, options);
            }
            static trace(url, options) {
                return new AjaxRequest(Web.METHOD_TRACE, url, options);
            }
            static patch(url, options) {
                return new AjaxRequest(Web.METHOD_PATCH, url, options);
            }
        }
        Web.Ajax = Ajax;
    })(Web = Core.Web || (Core.Web = {}));
})(Core || (Core = {}));
