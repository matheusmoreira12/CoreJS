var Core;
(function (Core) {
    var Web;
    (function (Web) {
        class AjaxRequestOptions {
            constructor(async = true, data = "", user = "", password = "") {
                this.asynchronous = async;
                this.user = user;
                this.password = password;
                this.data = data;
            }
        }
        Web.AjaxRequestOptions = AjaxRequestOptions;
        class AjaxRequestInfo {
            constructor(method, url, options = new AjaxRequestOptions()) {
                this.method = method;
                this.url = url;
                this.options = options;
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
                this._createAndOpenRequest(method, url, options);
            }
            _requestReadyStateChanged() {
                let xhr = this.baseRequest;
                let info = this.info;
                switch (xhr.readyState) {
                    case XMLHttpRequest.DONE:
                        this.doneEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        if (xhr.status == Web.STATUS_OK)
                            this.loadedEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        else {
                            this.errorEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        }
                        break;
                    case XMLHttpRequest.HEADERS_RECEIVED:
                        this.headersReceivedEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                    case XMLHttpRequest.LOADING:
                        this.loadingEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                    case XMLHttpRequest.OPENED:
                        this.openedEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                    case XMLHttpRequest.UNSENT:
                        this.unsentEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                }
            }
            _requestProgress(event) {
                this.progressEvent.invoke({ done: event.loaded, total: event.total });
            }
            _createAndOpenRequest(method, url, options) {
                let xhr = new XMLHttpRequest();
                xhr.open(method, url, options.asynchronous, options.user, options.password);
                xhr.send(options.data);
                xhr.onreadystatechange = () => this._requestReadyStateChanged();
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
(function (Core) {
    var Events;
    (function (Events) {
        class AjaxEvent extends Core.MethodGroup {
            constructor(target, defaultListener) {
                super(target);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
            invoke(args) {
                super.invoke(args);
            }
        }
        Events.AjaxEvent = AjaxEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Web.Ajax.js.map