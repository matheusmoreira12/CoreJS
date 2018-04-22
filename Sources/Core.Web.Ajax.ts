namespace Core.Web {

        export class AjaxRequestOptions {
            constructor(async: boolean = true, data: any = "", user: string = "", password: string = "") {
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
                        this.doneEvent.invoke({ baseRequest: xhr, reqInfo: info });

                        if (xhr.status == STATUS_OK)
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

            private _requestProgress(event: ProgressEvent) {
                this.progressEvent.invoke({ done: event.loaded, total: event.total });
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
    export type AjaxEventArgs = {
        baseRequest: XMLHttpRequest,
        reqInfo: Web.AjaxRequestInfo
    };
    export type AjaxEventListener = (target: Web.AjaxRequest, args: AjaxEventArgs) => void;

    export class AjaxEvent extends MethodGroup {
        constructor(target: Web.AjaxRequest, defaultListener?: AjaxEventListener) {
            super(target);
        }

        target: Web.AjaxRequest;

        attach(listener: AjaxEventListener | AjaxEvent) {
            super.attach(listener);
        }

        detach(listener: AjaxEventListener | AjaxEvent) {
            super.detach(listener);
        }

        invoke(args: AjaxEventArgs) {
            super.invoke(args);
        }
    }
}