///<reference path="Core.ts"/>
///<reference path="Core.Web.ts"/>
///<reference path="Core.Events.ts"/>

namespace Core.Web {

    export class AjaxRequestOptions {
        constructor(async: boolean = true, data: any = "", user: string = "", password: string = "") {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("async", async, BOOL);
            Validation.RuntimeValidator.validateParameter("user", user, STRING);
            Validation.RuntimeValidator.validateParameter("password", password, STRING);

            this.asynchronous = async;
            this.user = user;
            this.password = password;
            this.data = data;
        }

        asynchronous: boolean;
        user: string;
        password: string;
        data: any;
    }

    export class AjaxRequestInfo {
        constructor(method: string, url: string, options: AjaxRequestOptions = new AjaxRequestOptions()) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("method", method, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("url", url, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("options", options, AjaxRequestOptions);

            this.method = method;
            this.url = url;
            this.options = options;
        }

        method: string;
        url: string;
        options: AjaxRequestOptions;
    }

    export class AjaxRequest {

        doneEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        loadedEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        errorEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        headersReceivedEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        loadingEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        openedEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        unsentEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        progressEvent: Events.ProgressEvent = new Events.ProgressEvent(this);

        private _requestReadyStateChanged() {
            let xhr = this.baseRequest;
            let info = this.info;

            switch (xhr.readyState) {
                case XMLHttpRequest.DONE:
                    this.doneEvent.invoke();

                    if (xhr.status == STATUS_OK)
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

        private _requestProgress(event: ProgressEvent) {
            let loaded = event.loaded,
                total = event.total,
                progressPercentage: number = loaded / total;

            this.progressEvent.invoke(loaded, total, progressPercentage);
        }

        private _createAndOpenRequest(method: string, url: string, options: AjaxRequestOptions) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, options.asynchronous, options.user, options.password);
            xhr.send(options.data);

            xhr.onreadystatechange = () => this._requestReadyStateChanged();

            this.baseRequest = xhr;
        }

        constructor(method: string, url: string, options?: AjaxRequestOptions) {
            this.info = new AjaxRequestInfo(method, url, options);
            this._createAndOpenRequest(method, url, options);
        }

        baseRequest: XMLHttpRequest;
        info: AjaxRequestInfo;
    }

    export class Ajax {

        static get(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_GET, url, options);
        }
        static head(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_HEAD, url, options);
        }
        static post(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_POST, url, options);
        }
        static put(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_PUT, url, options);
        }
        static delete(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_DELETE, url, options);
        }
        static connect(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_CONNECT, url, options);
        }
        static options(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_OPTIONS, url, options);
        }
        static trace(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_TRACE, url, options);
        }
        static patch(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_PATCH, url, options);
        }
    }
}

namespace Core.Events {
    //Ajax event
    export type AjaxEventListener = (src: Web.AjaxRequest, baseRequest: XMLHttpRequest, reqInfo: Web.AjaxRequestInfo) => void;

    export class AjaxEvent extends MethodGroup {
        constructor(target: Web.AjaxRequest, defaultListener?: AjaxEventListener) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, [Function, Web.AjaxRequest], true);

            super(target);
        }

        target: Web.AjaxRequest;

        attach(listener: AjaxEventListener | AjaxEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, AjaxEvent]);

            super.attach(listener);
        }

        detach(listener: AjaxEventListener | AjaxEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, AjaxEvent]);

            super.detach(listener);
        }

        invoke(thisArg?: any) {
            super.invoke(null, this.target.baseRequest, this.target.info);
        }
    }
}